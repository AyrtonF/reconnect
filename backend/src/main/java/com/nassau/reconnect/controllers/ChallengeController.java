package com.nassau.reconnect.controllers;

import com.nassau.reconnect.dtos.ApiResponse;
import com.nassau.reconnect.dtos.challenge.ChallengeCreateDto;
import com.nassau.reconnect.dtos.challenge.ChallengeDto;
import com.nassau.reconnect.models.enums.ChallengeStatus;
import com.nassau.reconnect.models.enums.ChallengeType;
import com.nassau.reconnect.services.ChallengeService;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/challenges")
@RequiredArgsConstructor
@CrossOrigin
@Slf4j
public class ChallengeController {

    private final ChallengeService challengeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ChallengeDto>>> getAllChallenges() {
        List<ChallengeDto> challenges = challengeService.getAllChallenges();
        return ResponseEntity.ok(ApiResponse.success(challenges));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ChallengeDto>> getChallengeById(@PathVariable Long id) {
        ChallengeDto challenge = challengeService.getChallengeById(id);
        return ResponseEntity.ok(ApiResponse.success(challenge));
    }

    @GetMapping("/family/{familyId}")
    public ResponseEntity<ApiResponse<List<ChallengeDto>>> getChallengesByFamily(@PathVariable Long familyId) {
        List<ChallengeDto> challenges = challengeService.getChallengesByFamily(familyId);
        return ResponseEntity.ok(ApiResponse.success(challenges));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<ChallengeDto>>> getChallengesByStatus(@PathVariable ChallengeStatus status) {
        List<ChallengeDto> challenges = challengeService.getChallengesByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(challenges));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<ChallengeDto>>> getChallengesByType(@PathVariable ChallengeType type) {
        List<ChallengeDto> challenges = challengeService.getChallengesByType(type);
        return ResponseEntity.ok(ApiResponse.success(challenges));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ChallengeDto>> createChallenge(@Valid @RequestBody ChallengeCreateDto challengeCreateDto) {
        ChallengeDto createdChallenge = challengeService.createChallenge(challengeCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdChallenge, "Challenge created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @challengeSecurity.canManageChallenge(#id)")
    public ResponseEntity<ApiResponse<ChallengeDto>> updateChallenge(
            @PathVariable Long id,
            @Valid @RequestBody ChallengeDto challengeUpdateDto) {
        ChallengeDto updatedChallenge = challengeService.updateChallenge(id, challengeUpdateDto);
        return ResponseEntity.ok(ApiResponse.success(updatedChallenge, "Challenge updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @challengeSecurity.canManageChallenge(#id)")
    public ResponseEntity<ApiResponse<Void>> deleteChallenge(@PathVariable Long id) {
        challengeService.deleteChallenge(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Challenge deleted successfully"));
    }

    @PostMapping("/{challengeId}/participate/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isSameUser(#userId)")
    public ResponseEntity<ApiResponse<Boolean>> participateInChallenge(
            @PathVariable Long challengeId,
            @PathVariable Long userId) {
        boolean joined = challengeService.participateInChallenge(challengeId, userId);
        if (joined) {
            return ResponseEntity.ok(ApiResponse.success(true, "Successfully joined the challenge"));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to join challenge", "User may already be participating"));
        }
    }

    @PostMapping("/{challengeId}/complete/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.isSameUser(#userId)")
    public ResponseEntity<ApiResponse<Boolean>> completeChallenge(
            @PathVariable Long challengeId,
            @PathVariable Long userId) {
        boolean completed = challengeService.completeChallenge(challengeId, userId);
        if (completed) {
            return ResponseEntity.ok(ApiResponse.success(true, "Challenge completed successfully"));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to complete challenge", "User may not be participating in this challenge"));
        }
    }

    @PostConstruct
    public void init() {
        try {
            // Criar primeiro desafio - Físico
            if (!challengeExists("Caminhada Diária")) {
                ChallengeCreateDto challenge1 = ChallengeCreateDto.builder()
                        .title("Caminhada Diária")
                        .description("Faça uma caminhada de pelo menos 30 minutos todos os dias por uma semana")
                        .score(150)
                        .type(ChallengeType.PHYSICAL)
                        .familyId(null) // Desafio geral, não específico de uma família
                        .build();

                challengeService.createChallenge(challenge1);
                log.info("Desafio 'Caminhada Diária' criado com sucesso");
            }

            // Criar segundo desafio - Intelectual
            if (!challengeExists("Leitura Semanal")) {
                ChallengeCreateDto challenge2 = ChallengeCreateDto.builder()
                        .title("Leitura Semanal")
                        .description("Leia pelo menos 1 livro ou 3 artigos educativos durante a semana")
                        .score(100)
                        .type(ChallengeType.INTELLECTUAL)
                        .familyId(null) // Desafio geral, não específico de uma família
                        .build();

                challengeService.createChallenge(challenge2);
                log.info("Desafio 'Leitura Semanal' criado com sucesso");
            }

            log.info("Inicialização de desafios padrão concluída");

        } catch (Exception e) {
            log.error("Erro ao criar desafios padrão: {}", e.getMessage());
        }
    }

    private boolean challengeExists(String title) {
        try {
            List<ChallengeDto> allChallenges = challengeService.getAllChallenges();
            return allChallenges.stream().anyMatch(challenge -> challenge.getTitle().equals(title));
        } catch (Exception e) {
            log.warn("Erro ao verificar se desafio existe: {}", e.getMessage());
            return false;
        }
    }
}