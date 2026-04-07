(function () {
  const STATE = {
    currentLevel: 0,
    completed: new Array(12).fill(false),
  };

  const LEVELS = [
    {
      id: 1,
      title: 'Nível 1 — A lógica XOR (⊕)',
      theory: `
            <p>A cifra de Vernam e muitas cifras de fluxo usam o <strong>ou exclusivo (XOR)</strong> bit a bit: igual → 0, diferente → 1.</p>
            <p>Propriedade-chave: <strong>A ⊕ B ⊕ B = A</strong> (reversível enquanto a chave é conhecida).</p>
          `,
      renderChallenge(root) {
        root.innerHTML = `
              <p class="text-sm text-slate-400">Mensagem: <code class="text-msg">10110110</code> · Chave: <code class="text-key">01011010</code></p>
              <label class="block text-sm font-semibold text-slate-200">Resultado XOR (8 bits, sem espaços)</label>
              <input id="in-xor" type="text" maxlength="16" class="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 font-mono text-lg tracking-widest text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" placeholder="11101100" autocomplete="off" />
            `;
      },
      check() {
        const v = (document.getElementById('in-xor')?.value || '').replace(/\s/g, '');
        return v === '11101100';
      },
      viz() {
        return renderXorRows('10110110', '01011010', '11101100');
      },
      caption: 'Cada bit do cifrado é msg ⊕ chave.',
    },
    {
      id: 2,
      title: 'Nível 2 — Reversibilidade',
      theory: `
            <p>Se <strong>C = M ⊕ K</strong>, então <strong>M = C ⊕ K</strong>. Recupere a mensagem sem armazenar M explicitamente.</p>
          `,
      renderChallenge(root) {
        root.innerHTML = `
              <p class="text-sm text-slate-400">Cifrado: <code class="text-ciph">11001101</code> · Chave: <code class="text-key">10101010</code></p>
              <label class="block text-sm font-semibold text-slate-200">Mensagem original M (8 bits)</label>
              <input id="in-inv" type="text" class="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 font-mono text-lg tracking-widest text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" autocomplete="off" />
            `;
      },
      check() {
        const v = (document.getElementById('in-inv')?.value || '').replace(/\s/g, '');
        return v === '01100111';
      },
      viz() {
        return renderXorRows('01100111', '10101010', '11001101', true);
      },
      caption: 'Azul foi recuperado a partir do verde usando a mesma chave vermelha.',
    },
    {
      id: 3,
      title: 'Nível 3 — O conceito de stream',
      theory: `
            <p>Em uma <strong>cifra de fluxo</strong>, um gerador produz um fluxo de bits ou blocos pseudoaleatórios (keystream) que é combinado com a mensagem.</p>
            <p><strong>Ative o gerador</strong> para produzir o fluxo contínuo e cifrar a frase (simulação).</p>
          `,
      renderChallenge(root) {
        root.innerHTML = `
              <p class="text-sm text-slate-400">Frase alvo (bits simulados): <code class="text-msg">1101001010110110...</code> (período longo)</p>
              <label class="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700 bg-slate-950/80 p-4">
                <input id="chk-stream" type="checkbox" class="h-5 w-5 rounded border-slate-500 text-cyan-600 focus:ring-cyan-500" />
                <span class="text-sm text-slate-200">Gerador de bits ativo (fluxo contínuo ligado na interface)</span>
              </label>
            `;
      },
      check() {
        return document.getElementById('chk-stream')?.checked === true;
      },
      viz() {
        const ks = '1010110010101101';
        return renderStreamLane(ks);
      },
      caption: 'Keystream vermelho em fluxo contínuo contra a mensagem azul.',
    },
    {
      id: 4,
      title: 'Nível 4 — O problema do RC4',
      theory: `
            <p>O RC4 (usado no WEP original) apresenta <strong>vieses nos primeiros bytes</strong> do keystream. Boas implementações <strong>descartam</strong> os primeiros bytes (ex.: 1024 ou 256, dependendo do perfil) antes de usar o fluxo.</p>
          `,
      renderChallenge(root) {
        root.innerHTML = `
              <label class="block text-sm font-semibold text-slate-200">Quantos bits iniciais devem ser descartados neste laboratório?</label>
              <input id="in-drop" type="text" inputmode="numeric" class="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 font-mono text-lg text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" placeholder="1024" />
              <p class="text-xs text-slate-500">Digite o número sugerido no enunciado (bits).</p>
            `;
      },
      check() {
        const n = parseInt((document.getElementById('in-drop')?.value || '').trim(), 10);
        return n === 1024;
      },
      viz() {
        return renderDropVisualization();
      },
      caption: 'Fluxo “suficientemente aquecido” após descarte dos primeiros 1024 bits.',
    },
    {
      id: 5,
      title: 'Nível 5 — Arquitetura WEP 64',
      theory: `
            <p>WEP 64 bits agrega <strong>chave secreta de 40 bits</strong> (5 bytes = 10 hex) com um <strong>IV de 24 bits</strong> (3 bytes = 6 hex) para formar a seed do RC4.</p>
            <p>Exemplo para montar na interface: segredo <code class="text-msg">A1B2C3D4E5</code>, IV <code class="text-key">9F01AB</code>.</p>
          `,
      renderChallenge(root) {
        root.innerHTML = `
              <p class="text-sm text-slate-400">Complete: chave fixa (10 hex) + IV (6 hex)</p>
              <div class="grid gap-3 sm:grid-cols-2">
                <div>
                  <label class="text-xs font-semibold uppercase text-slate-400">Chave 40 bits (10 hex)</label>
                  <input id="w64-key" type="text" maxlength="10" class="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 font-mono uppercase text-white" placeholder="A1B2C3D4E5" />
                </div>
                <div>
                  <label class="text-xs font-semibold uppercase text-slate-400">IV 24 bits (6 hex)</label>
                  <input id="w64-iv" type="text" maxlength="6" class="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 font-mono uppercase text-white" placeholder="9F01AB" />
                </div>
              </div>
            `;
      },
      check() {
        const k = (document.getElementById('w64-key')?.value || '').replace(/\s/g, '').toUpperCase();
        const iv = (document.getElementById('w64-iv')?.value || '').replace(/\s/g, '').toUpperCase();
        return k === 'A1B2C3D4E5' && iv === '9F01AB';
      },
      viz() {
        return renderWepKey('A1B2C3D4E5', '9F01AB', '64');
      },
      caption: 'Seed RC4 = 40 bits + 24 bits (total 64 bits de material de chave efetivo).',
    },
    {
      id: 6,
      title: 'Nível 6 — Arquitetura WEP 128',
      theory: `
            <p>WEP 128 utiliza <strong>104 bits</strong> de segredo (26 dígitos hex) mais o mesmo <strong>IV de 24 bits</strong>.</p>
            <p>Exemplo: segredo <code class="text-msg">00112233445566778899AABBCC</code>, IV <code class="text-key">DEAD01</code>.</p>
          `,
      renderChallenge(root) {
        root.innerHTML = `
              <div class="grid gap-3 sm:grid-cols-2">
                <div class="sm:col-span-2">
                  <label class="text-xs font-semibold uppercase text-slate-400">Chave 104 bits (26 hex)</label>
                  <input id="w128-key" type="text" maxlength="26" class="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 font-mono text-sm uppercase text-white" />
                </div>
                <div>
                  <label class="text-xs font-semibold uppercase text-slate-400">IV (6 hex)</label>
                  <input id="w128-iv" type="text" maxlength="6" class="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 font-mono uppercase text-white" />
                </div>
              </div>
            `;
        root.querySelector('#w128-key').placeholder = '00112233445566778899AABBCC';
        root.querySelector('#w128-iv').placeholder = 'DEAD01';
      },
      check() {
        const k = (document.getElementById('w128-key')?.value || '').replace(/\s/g, '').toUpperCase();
        const iv = (document.getElementById('w128-iv')?.value || '').replace(/\s/g, '').toUpperCase();
        return k === '00112233445566778899AABBCC' && iv === 'DEAD01';
      },
      viz() {
        return renderWepKey('00112233445566778899AABBCC', 'DEAD01', '128');
      },
      caption: 'IV curto permanece o elo fraco: só 2²⁴ IVs possíveis.',
    },
    {
      id: 7,
      title: 'Nível 7 — IV por frame (1500 octetos)',
      theory: `
            <p>No WEP, o IV deveria ser <strong>único por pacote</strong>. Em redes rápidas, um frame Ethernet típico chega a <strong>~1500 octetos</strong> (MTU). A política segura muda o IV <strong>a cada novo frame</strong>.</p>
          `,
      renderChallenge(root) {
        root.innerHTML = `
              <label class="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700 bg-slate-950/80 p-4">
                <input id="chk-iv-frame" type="checkbox" class="h-5 w-5 rounded border-slate-500 text-cyan-600 focus:ring-cyan-500" />
                <span class="text-sm text-slate-200">Configurar: incrementar / trocar IV a cada frame de até 1500 octetos</span>
              </label>
            `;
      },
      check() {
        return document.getElementById('chk-iv-frame')?.checked === true;
      },
      viz() {
        return renderFramesIv();
      },
      caption: 'Cada “pacote” ilustrado → novo IV na interface.',
    },
    {
      id: 8,
      title: 'Nível 8 — Limite dos 24 bits',
      theory: `
            <p>O espaço do IV é <strong>2²⁴</strong>. Com frames de <strong>1500 bytes</strong>, o volume de dados antes de forçar repetição de IV (em cenário ideal de um IV por pacote) é aproximadamente:</p>
            <p class="font-mono text-cyan-200">1500 × 2²⁴ bytes ≈ 23,44 GiB</p>
            <p>Isso explica por que colisões de IV <strong>são inevitáveis</strong> com tráfego intenso.</p>
          `,
      renderChallenge(root) {
        root.innerHTML = `
              <label class="block text-sm font-semibold text-slate-200">Qual expressão correta para o volume até “esgotar” IVs (um IV por pacote)?</label>
              <select id="sel-gib" class="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none">
                <option value="">Escolha…</option>
                <option value="wrong1">2²⁴ × 1 bit</option>
                <option value="ok">1500 × 2²⁴ bytes (ordem de dezenas de GiB)</option>
                <option value="wrong2">1500 ÷ 2²⁴ bytes</option>
              </select>
            `;
      },
      check() {
        return document.getElementById('sel-gib')?.value === 'ok';
      },
      viz() {
        return renderMathIv();
      },
      caption: 'Poucos IVs + pacotes grandes → colisão cedo demais.',
    },
    {
      id: 9,
      title: 'Nível 9 — Fabricantes preguiçosos',
      theory: `
            <p>Alguns equipamentos simplesmente <strong>incrementam o IV</strong> (000001, 000002, …), tornando o próximo valor previsível e facilitando ataques estatísticos.</p>
          `,
      renderChallenge(root) {
        root.innerHTML = `
              <p class="text-sm text-slate-400">IV atual (hex): <code class="text-key">00 00 0A</code> → próximo na sequência linear?</p>
              <label class="block text-sm font-semibold text-slate-200">Próximo IV (6 hex, maiúsculas)</label>
              <input id="in-next-iv" type="text" maxlength="6" class="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 font-mono uppercase text-white" placeholder="00000B" />
            `;
      },
      check() {
        const v = (document.getElementById('in-next-iv')?.value || '').replace(/\s/g, '').toUpperCase();
        return v === '00000B';
      },
      viz() {
        return renderIncrementalIv();
      },
      caption: 'Sequência determinística: atacante antecipa IV e reduz espaço de busca.',
    },
    {
      id: 10,
      title: 'Nível 10 — Ataque de colisão (mesma chave K)',
      theory: `
            <p>Se duas mensagens M₁ e M₂ usam o <strong>mesmo keystream K</strong>: C₁ = M₁ ⊕ K e C₂ = M₂ ⊕ K, então C₁ ⊕ C₂ = M₁ ⊕ M₂ — o keystream <strong>cancela</strong>.</p>
          `,
      renderChallenge(root) {
        root.innerHTML = `
              <p class="text-sm text-slate-400">C₁: <code class="text-ciph">1100</code> · C₂: <code class="text-ciph">1010</code> (mesma K). XOR dos cifrados:</p>
              <label class="block text-sm font-semibold text-slate-200">C₁ ⊕ C₂ (4 bits)</label>
              <input id="in-col" type="text" maxlength="8" class="mt-1 w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 font-mono tracking-widest text-white" />
            `;
      },
      check() {
        const v = (document.getElementById('in-col')?.value || '').replace(/\s/g, '');
        return v === '0110';
      },
      viz() {
        return renderCollisionViz();
      },
      caption: 'Padrão revelado: combinação das mensagens sem recuperar K diretamente.',
    },
    {
      id: 11,
      title: 'Nível 11 — Modo OFB (Output Feedback)',
      theory: `
            <p>Em <strong>OFB</strong>, o bloco cifrado do registro de feedback é usado como <strong>entrada do próximo passo antes</strong> de XOR com o bloco de mensagem — o keystream é gerado independentemente da plaintext.</p>
          `,
      renderChallenge(root) {
        root.innerHTML = `
              <p class="text-sm text-slate-400">Ligue o fio: saída do bloco cifrado → próximo estágio <em>antes</em> do XOR com M.</p>
              <label class="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700 bg-slate-950/80 p-4">
                <input id="chk-ofb" type="checkbox" class="h-5 w-5 rounded border-slate-500 text-cyan-600 focus:ring-cyan-500" />
                <span class="text-sm text-slate-200">Feedback OFB: próximo bloco usa E<sub>k</sub>(registro), não o resultado pós-XOR</span>
              </label>
            `;
      },
      check() {
        return document.getElementById('chk-ofb')?.checked === true;
      },
      viz() {
        return renderModeDiagram('ofb');
      },
      caption: 'Seta de feedback parte do registro de saída do bloco (antes do XOR com M).',
    },
    {
      id: 12,
      title: 'Nível 12 — Modo CFB (Cipher Feedback)',
      theory: `
            <p>Em <strong>CFB</strong>, o que retroalimenta o próximo estágio é tomado <strong>depois</strong> do XOR: o <strong>bloco cifrado resultante</strong> (ou parte dele) entra no shift do registro.</p>
          `,
      renderChallenge(root) {
        root.innerHTML = `
              <label class="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700 bg-slate-950/80 p-4">
                <input id="chk-cfb" type="checkbox" class="h-5 w-5 rounded border-slate-500 text-cyan-600 focus:ring-cyan-500" />
                <span class="text-sm text-slate-200">Feedback CFB: próximo registro usa o ciphertext (pós-XOR), não só a saída interna pré-XOR</span>
              </label>
            `;
      },
      check() {
        return document.getElementById('chk-cfb')?.checked === true;
      },
      viz() {
        return renderModeDiagram('cfb');
      },
      caption: 'CFB encadeia através do que foi transmitido (cifrado).',
    },
  ];

  function bitSpan(bits, cls) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < bits.length; i++) {
      const b = bits[i];
      if (b !== '0' && b !== '1') continue;
      const el = document.createElement('span');
      el.className = `bit-cell inline-flex h-8 w-8 items-center justify-center rounded-md text-xs font-mono font-bold shadow ${cls}`;
      el.textContent = b;
      frag.appendChild(el);
    }
    return frag;
  }

  function rowLabel(t, colorClass) {
    const d = document.createElement('div');
    d.className = 'text-[10px] font-bold uppercase tracking-wider ' + colorClass;
    d.textContent = t;
    return d;
  }

  function renderXorRows(msg, key, ciph, highlightMsg = false) {
    const wrap = document.createElement('div');
    wrap.className = 'space-y-2';
    const r1 = document.createElement('div');
    r1.appendChild(rowLabel('Mensagem', 'text-blue-400'));
    const b1 = document.createElement('div');
    b1.className = 'flex flex-wrap gap-1';
    b1.appendChild(bitSpan(msg, 'bit-msg'));
    r1.appendChild(b1);
    const r2 = document.createElement('div');
    r2.appendChild(rowLabel('Keystream', 'text-red-400'));
    const b2 = document.createElement('div');
    b2.className = 'flex flex-wrap gap-1';
    b2.appendChild(bitSpan(key, 'bit-key'));
    r2.appendChild(b2);
    const r3 = document.createElement('div');
    r3.appendChild(rowLabel('Cifrado', 'text-emerald-400'));
    const b3 = document.createElement('div');
    b3.className = 'flex flex-wrap gap-1';
    b3.appendChild(bitSpan(ciph, 'bit-ciph'));
    r3.appendChild(b3);
    wrap.appendChild(r1);
    wrap.appendChild(r2);
    wrap.appendChild(r3);
    return wrap;
  }

  function renderStreamLane(ks) {
    const wrap = document.createElement('div');
    wrap.className = 'rounded-xl border border-slate-700 bg-slate-950/50 p-4';
    wrap.appendChild(rowLabel('Keystream × Mensagem (simulado)', 'text-slate-400'));
    const flow = document.createElement('div');
    flow.className = 'mt-2 flex flex-wrap gap-1 overflow-hidden';
    flow.appendChild(bitSpan(ks, 'bit-key'));
    const dots = document.createElement('span');
    dots.className = 'self-center font-mono text-xs text-slate-500';
    dots.textContent = '···';
    flow.appendChild(dots);
    wrap.appendChild(flow);
    return wrap;
  }

  function renderDropVisualization() {
    const wrap = document.createElement('div');
    wrap.className = 'space-y-2 font-mono text-xs';
    wrap.innerHTML = `
          <div class="flex flex-wrap gap-0.5 opacity-40">${Array.from({ length: 24 }, () => '<span class="inline-flex h-6 w-4 items-center justify-center rounded bg-red-900/50 text-[9px] text-red-200/70">×</span>').join('')}</div>
          <p class="text-slate-500">↑ primeiros bits descartados (armazenamento inseguro)</p>
          <div class="flex flex-wrap gap-1">${'10101101'
      .split('')
      .map((b) => `<span class="inline-flex h-8 w-8 items-center justify-center rounded-md bit-key">${b}</span>`)
      .join('')}</div>
        `;
    return wrap;
  }

  function renderWepKey(keyHex, ivHex, label) {
    const wrap = document.createElement('div');
    wrap.className = 'space-y-3 text-center';
    wrap.innerHTML = `
          <p class="text-sm text-slate-400">WEP ${label}</p>
          <div class="flex flex-wrap justify-center gap-2">
            ${keyHex
        .match(/.{1,2}/g)
        .map((pair) => `<span class="rounded-lg border border-blue-500/50 bg-msg/20 px-2 py-3 font-mono text-sm text-blue-200">${pair}</span>`)
        .join('')}
          </div>
          <p class="text-xs text-slate-500">+</p>
          <div class="flex justify-center gap-2">
            ${ivHex
        .match(/.{1,2}/g)
        .map((pair) => `<span class="rounded-lg border border-red-500/50 bg-key/20 px-3 py-3 font-mono text-sm text-red-200">${pair}</span>`)
        .join('')}
          </div>
          <p class="text-xs text-emerald-400">→ seed RC4 (${(keyHex.length + ivHex.length) / 2} bytes)</p>
        `;
    return wrap;
  }

  function renderFramesIv() {
    const wrap = document.createElement('div');
    wrap.className = 'space-y-2';
    ['Frame A (≤1500 B)', 'Frame B', 'Frame C'].forEach((t, i) => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2';
      row.innerHTML = `
            <span class="text-xs text-slate-300">${t}</span>
            <span class="font-mono text-xs text-key">IV ${(0x700901 + i).toString(16).toUpperCase().padStart(6, '0')}</span>
          `;
      wrap.appendChild(row);
    });
    return wrap;
  }

  function renderMathIv() {
    const wrap = document.createElement('div');
    wrap.className = 'rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-sm text-amber-100/90';
    wrap.innerHTML = `
          <p class="font-mono text-lg">2²⁴ ≈ 16,7 × 10⁶ pacotes</p>
          <p class="mt-2 text-xs text-amber-200/80">1500 B × 2²⁴ ≈ 23,44 GiB de payload antes de repetir IV (modelo 1 IV/pacote).</p>
        `;
    return wrap;
  }

  function renderIncrementalIv() {
    const wrap = document.createElement('div');
    wrap.className = 'flex flex-wrap items-center justify-center gap-2 font-mono text-sm';
    wrap.innerHTML = `
          <span class="rounded-lg bg-key/20 px-2 py-2 text-key">00000A</span>
          <span class="text-slate-500">→</span>
          <span class="rounded-lg bg-emerald-500/20 px-2 py-2 text-emerald-300">00000B</span>
          <span class="text-slate-500">→</span>
          <span class="rounded-lg bg-slate-800 px-2 py-2 text-slate-400">···</span>
        `;
    return wrap;
  }

  function renderCollisionViz() {
    const wrap = document.createElement('div');
    wrap.className = 'space-y-3';
    const c1 = document.createElement('div');
    c1.appendChild(rowLabel('C₁ (cifrado estação 1)', 'text-emerald-400'));
    const b1 = document.createElement('div');
    b1.className = 'flex flex-wrap gap-1';
    b1.appendChild(bitSpan('1100', 'bit-ciph'));
    c1.appendChild(b1);
    const c2 = document.createElement('div');
    c2.appendChild(rowLabel('C₂ (mesma K, outra MSG)', 'text-emerald-400'));
    const b2 = document.createElement('div');
    b2.className = 'flex flex-wrap gap-1';
    b2.appendChild(bitSpan('1010', 'bit-ciph'));
    c2.appendChild(b2);
    wrap.appendChild(c1);
    wrap.appendChild(c2);
    const hint = document.createElement('p');
    hint.className = 'text-center text-[11px] text-slate-500';
    hint.textContent = 'C₁ ⊕ C₂ elimina K e deixa M₁ ⊕ M₂';
    wrap.appendChild(hint);
    return wrap;
  }

  function renderModeDiagram(mode) {
    const wrap = document.createElement('div');
    wrap.className = 'relative rounded-xl border border-slate-700 bg-slate-950/70 p-4 text-xs';
    const isOfb = mode === 'ofb';
    wrap.innerHTML = `
          <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div class="rounded border border-blue-500/40 bg-msg/10 p-2 text-center text-blue-200">M</div>
            <div class="text-center text-slate-500">⊕</div>
            <div class="rounded border border-emerald-500/40 bg-ciph/10 p-2 text-center text-emerald-200">C</div>
          </div>
          <div class="mx-auto my-3 h-8 w-px bg-slate-600"></div>
          <div class="flex flex-col items-center gap-2">
            <div class="rounded border border-violet-500/50 bg-violet-950/40 px-4 py-2 font-mono text-violet-200">E<sub>k</sub>(reg)</div>
            ${isOfb
        ? '<p class="text-center text-[11px] text-cyan-300">Feedback: saída de E<sub>k</sub> → próximo reg (antes do XOR)</p>'
        : '<p class="text-center text-[11px] text-cyan-300">Feedback: C (pós-XOR) → próximo reg</p>'}
          </div>
        `;
    return wrap;
  }

  function playPacketAnimation() {
    const layer = document.getElementById('packet-layer');
    if (!layer) return;
    layer.innerHTML = '';
    const pkt = document.createElement('div');
    pkt.className =
      'packet-run absolute left-[10%] top-1/2 -mt-5 flex h-10 w-24 items-center justify-center rounded-lg border-2 border-emerald-400 bg-emerald-950/90 font-mono text-[10px] font-bold text-emerald-200 shadow-lg shadow-emerald-500/20';
    pkt.textContent = 'DATA•CRC';
    layer.appendChild(pkt);
    setTimeout(() => {
      pkt.classList.remove('packet-run');
    }, 2300);
  }

  function updateProgress() {
    const done = STATE.completed.filter(Boolean).length;
    const pct = Math.round((done / 12) * 100);
    document.getElementById('progress-bar').style.width = pct + '%';
    const el = document.getElementById('progress-text');
    if (done >= 12) {
      el.textContent = '100% — Trilha concluída! Você dominou o fluxo e as fragilidades do WEP.';
    } else {
      el.textContent = `${pct}% — ${done} de 12 níveis concluídos`;
    }
  }

  function renderTabs() {
    const nav = document.getElementById('level-tabs');
    nav.innerHTML = '';
    LEVELS.forEach((lv, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className =
        'rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition ' +
        (STATE.currentLevel === idx
          ? 'border-cyan-500 bg-cyan-950/60 text-cyan-200'
          : STATE.completed[idx]
            ? 'border-emerald-600/60 bg-emerald-950/30 text-emerald-300'
            : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600');
      btn.textContent = (idx + 1).toString();
      btn.title = lv.title;
      btn.addEventListener('click', () => {
        STATE.currentLevel = idx;
        renderLevel();
      });
      nav.appendChild(btn);
    });
  }

  function renderLevel() {
    const lv = LEVELS[STATE.currentLevel];
    document.getElementById('level-badge').textContent = `Nível ${STATE.currentLevel + 1} / 12`;
    document.getElementById('panel-title').textContent = lv.title;
    document.getElementById('panel-theory').innerHTML = lv.theory;
    lv.renderChallenge(document.getElementById('challenge-area'));
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'text-sm font-medium';

    const viz = document.getElementById('viz-bits');
    viz.innerHTML = '';
    viz.appendChild(typeof lv.viz === 'function' ? lv.viz() : document.createElement('div'));
    document.getElementById('viz-caption').textContent = lv.caption || '';

    renderTabs();
    updateProgress();
  }

  document.getElementById('btn-check').addEventListener('click', () => {
    const lv = LEVELS[STATE.currentLevel];
    const fb = document.getElementById('feedback');
    if (lv.check()) {
      STATE.completed[STATE.currentLevel] = true;
      fb.textContent = 'Correto! Pacote liberado.';
      fb.className = 'text-sm font-medium text-emerald-400';
      playPacketAnimation();
      updateProgress();
      renderTabs();
    } else {
      fb.textContent = 'Ainda não — revise a teoria ou os valores.';
      fb.className = 'text-sm font-medium text-amber-400';
    }
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    if (!confirm('Reiniciar todo o progresso dos 12 níveis?')) return;
    STATE.completed = new Array(12).fill(false);
    STATE.currentLevel = 0;
    renderLevel();
  });

  renderLevel();
})();
