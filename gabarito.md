# Gabarito — CryptoStream Quest

Respostas aceitas pela aplicação (validação em `app.js`). Espaços em branco são ignorados onde aplicável; hex pode ser em maiúsculas ou minúsculas (o código normaliza para maiúsculas).

---

## Nível 1 — A lógica XOR (⊕)

| Campo | Gabarito |
|--------|----------|
| Resultado XOR (8 bits) | `11101100` |

**Verificação:** `10110110` ⊕ `01011010` = `11101100`.

---

## Nível 2 — Reversibilidade

| Campo | Gabarito |
|--------|----------|
| Mensagem original M | `01100111` |

**Verificação:** `11001101` ⊕ `10101010` = `01100111`.

---

## Nível 3 — O conceito de stream

| Ação | Gabarito |
|--------|----------|
| Checkbox “Gerador de bits ativo…” | **Marcado** (ligado) |

---

## Nível 4 — O problema do RC4

| Campo | Gabarito |
|--------|----------|
| Bits iniciais a descartar | `1024` |

---

## Nível 5 — Arquitetura WEP 64

| Campo | Gabarito |
|--------|----------|
| Chave 40 bits (10 hex) | `A1B2C3D4E5` |
| IV 24 bits (6 hex) | `9F01AB` |

---

## Nível 6 — Arquitetura WEP 128

| Campo | Gabarito |
|--------|----------|
| Chave 104 bits (26 hex) | `00112233445566778899AABBCC` |
| IV (6 hex) | `DEAD01` |

---

## Nível 7 — IV por frame (1500 octetos)

| Ação | Gabarito |
|--------|----------|
| Checkbox “Configurar: incrementar / trocar IV…” | **Marcado** |

---

## Nível 8 — Limite dos 24 bits

| Campo | Gabarito |
|--------|----------|
| Select | Opção **“1500 × 2²⁴ bytes (ordem de dezenas de GiB)”** *(valor interno `ok`)* |

---

## Nível 9 — Fabricantes preguiçosos

| Campo | Gabarito |
|--------|----------|
| Próximo IV (6 hex) | `00000B` |

*(IV atual no enunciado: `00000A`; incremento linear.)*

---

## Nível 10 — Ataque de colisão (mesma chave K)

| Campo | Gabarito |
|--------|----------|
| C₁ ⊕ C₂ (4 bits) | `0110` |

**Verificação:** `1100` ⊕ `1010` = `0110`.

---

## Nível 11 — Modo OFB (Output Feedback)

| Ação | Gabarito |
|--------|----------|
| Checkbox “Feedback OFB: próximo bloco usa E_k(registro)…” | **Marcado** |

---

## Nível 12 — Modo CFB (Cipher Feedback)

| Ação | Gabarito |
|--------|----------|
| Checkbox “Feedback CFB: próximo registro usa o ciphertext…” | **Marcado** |

---

*Documento gerado para acompanhar o laboratório; o ideal é tentar resolver antes de consultar o gabarito.*
