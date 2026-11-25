// TRIAD PRO-TX SIBER Dynamic Presentation Module Engine
const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const SVG = {
  coverRadar: `<svg class="triad-svg triad-svg-cover" viewBox="0 0 360 200" fill="none" aria-hidden="true">
    <defs><radialGradient id="tg1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#00f0ff" stop-opacity=".28"/><stop offset="100%" stop-color="#00f0ff" stop-opacity="0"/></radialGradient></defs>
    <circle cx="180" cy="100" r="82" fill="url(#tg1)"/>
    <g class="triad-spin-slow"><circle cx="180" cy="100" r="76" stroke="#38bdf8" stroke-opacity=".28" stroke-dasharray="6 6"/><path d="M180 100 L180 24 A76 76 0 0 1 246 62 Z" fill="#00f0ff" fill-opacity=".14"/><circle cx="180" cy="24" r="4" fill="#00f0ff"/></g>
    <g class="triad-spin-rev"><circle cx="180" cy="100" r="54" stroke="#0284c7" stroke-opacity=".45" stroke-dasharray="14 8"/><circle cx="234" cy="100" r="3.5" fill="#38bdf8"/><circle cx="126" cy="100" r="3.5" fill="#10b981"/></g>
    <path class="triad-float-y" d="M180 62 L208 74 V102 C208 122 195 135 180 142 C165 135 152 122 152 102 V74 Z" fill="#0f172a" stroke="#00f0ff" stroke-width="2"/>
    <path class="triad-float-y" d="M170 102 L177 109 L192 92" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  aboutTriad: `<svg class="triad-svg triad-svg-inline" viewBox="0 0 360 190" fill="none" aria-hidden="true">
    <circle cx="152" cy="82" r="46" fill="#0284c7" fill-opacity=".12" stroke="#38bdf8" stroke-width="1.5"/>
    <circle cx="208" cy="82" r="46" fill="#00f0ff" fill-opacity=".10" stroke="#00f0ff" stroke-width="1.5"/>
    <circle cx="180" cy="126" r="46" fill="#10b981" fill-opacity=".12" stroke="#10b981" stroke-width="1.5"/>
    <circle cx="180" cy="98" r="14" fill="#070a11" stroke="#00f0ff" stroke-width="2"/>
    <circle cx="180" cy="98" r="5" fill="#00f0ff" class="triad-pulse-svg"/>
    <text x="122" y="68" fill="#cbd5e1" font-size="10" font-weight="700">GRC</text>
    <text x="208" y="68" fill="#cbd5e1" font-size="10" font-weight="700">OFFENSIVE</text>
    <text x="155" y="152" fill="#cbd5e1" font-size="10" font-weight="700">ASSURANCE</text>
  </svg>`,
  threatSurface: `<svg class="triad-svg triad-svg-banner" viewBox="0 0 360 175" fill="none" aria-hidden="true">
    <path d="M52 38 Q135 52 190 88" stroke="#f43f5e" stroke-width="1.8" class="triad-dash-flow"/>
    <path d="M52 88 L190 88" stroke="#f59e0b" stroke-width="1.8" class="triad-dash-flow"/>
    <path d="M52 138 Q135 124 190 88" stroke="#f43f5e" stroke-width="1.8" class="triad-dash-flow"/>
    <circle cx="52" cy="38" r="14" fill="#1e1b2e" stroke="#f43f5e" stroke-width="1.5"/><text x="48" y="42" fill="#fda4af" font-size="11" font-weight="700">R</text>
    <circle cx="52" cy="88" r="14" fill="#1e1b2e" stroke="#f59e0b" stroke-width="1.5"/><text x="48" y="92" fill="#fcd34d" font-size="11" font-weight="700">S</text>
    <circle cx="52" cy="138" r="14" fill="#1e1b2e" stroke="#f43f5e" stroke-width="1.5"/><text x="48" y="142" fill="#fda4af" font-size="11" font-weight="700">H</text>
    <path d="M196 26 Q218 88 196 150" stroke="#00f0ff" stroke-width="3" stroke-linecap="round"/>
    <rect x="236" y="54" width="84" height="68" rx="12" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="252" y="84" fill="#fff" font-size="11" font-weight="700">CORE</text><text x="252" y="100" fill="#94a3b8" font-size="10">ASSETS</text>
  </svg>`,
  complianceHub: `<svg class="triad-svg triad-svg-banner" viewBox="0 0 360 175" fill="none" aria-hidden="true">
    <line x1="95" y1="44" x2="180" y2="88" stroke="#38bdf8" stroke-width="1.5" class="triad-dash-flow"/>
    <line x1="265" y1="44" x2="180" y2="88" stroke="#38bdf8" stroke-width="1.5" class="triad-dash-flow"/>
    <line x1="95" y1="132" x2="180" y2="88" stroke="#10b981" stroke-width="1.5" class="triad-dash-flow"/>
    <line x1="265" y1="132" x2="180" y2="88" stroke="#10b981" stroke-width="1.5" class="triad-dash-flow"/>
    <rect x="44" y="26" width="90" height="32" rx="8" fill="#0f172a" stroke="#38bdf8"/><text x="64" y="46" fill="#fff" font-size="11" font-weight="700">UU PDP</text>
    <rect x="226" y="26" width="90" height="32" rx="8" fill="#0f172a" stroke="#38bdf8"/><text x="242" y="46" fill="#fff" font-size="11" font-weight="700">POJK 11</text>
    <rect x="44" y="118" width="90" height="32" rx="8" fill="#0f172a" stroke="#10b981"/><text x="58" y="138" fill="#fff" font-size="11" font-weight="700">ISO 27001</text>
    <rect x="226" y="118" width="90" height="32" rx="8" fill="#0f172a" stroke="#10b981"/><text x="248" y="138" fill="#fff" font-size="11" font-weight="700">KAMI</text>
    <circle cx="180" cy="88" r="28" fill="#070a11" stroke="#00f0ff" stroke-width="2"/><text x="163" y="92" fill="#00f0ff" font-size="11" font-weight="800">TRUST</text>
  </svg>`,
  isoScan: `<svg class="triad-svg triad-svg-mini" viewBox="0 0 120 130" fill="none" aria-hidden="true">
    <rect x="22" y="10" width="76" height="110" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
    <line x1="36" y1="36" x2="84" y2="36" stroke="#38bdf8" stroke-width="2"/>
    <line x1="36" y1="56" x2="76" y2="56" stroke="#94a3b8" stroke-width="2"/>
    <line x1="36" y1="76" x2="80" y2="76" stroke="#10b981" stroke-width="2"/>
    <text x="36" y="106" fill="#38bdf8" font-size="9" font-weight="700">ISO 27001</text>
    <line x1="16" y1="14" x2="104" y2="14" stroke="#00f0ff" stroke-opacity=".55" stroke-width="2" class="triad-scan-line"/>
  </svg>`,
  dcRack: `<svg class="triad-svg triad-svg-mini" viewBox="0 0 120 130" fill="none" aria-hidden="true">
    <rect x="22" y="10" width="76" height="110" rx="10" fill="#0f172a" stroke="#00f0ff" stroke-width="1.5"/>
    <rect x="32" y="24" width="56" height="16" rx="4" fill="#1e293b"/><circle cx="42" cy="32" r="3" fill="#10b981" class="triad-bar-pulse"/>
    <rect x="32" y="48" width="56" height="16" rx="4" fill="#1e293b"/><circle cx="42" cy="56" r="3" fill="#00f0ff" class="triad-bar-pulse d2"/>
    <rect x="32" y="72" width="56" height="16" rx="4" fill="#1e293b"/><circle cx="42" cy="80" r="3" fill="#10b981" class="triad-bar-pulse d3"/>
    <text x="36" y="106" fill="#00f0ff" font-size="9" font-weight="700">TIA-942C</text>
  </svg>`,
  pentestTarget: `<svg class="triad-svg triad-svg-mini" viewBox="0 0 120 130" fill="none" aria-hidden="true">
    <rect x="22" y="10" width="76" height="110" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
    <circle cx="60" cy="58" r="22" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 3" class="triad-spin-slow"/>
    <circle cx="60" cy="58" r="8" stroke="#f43f5e" stroke-width="1.5"/>
    <text x="36" y="106" fill="#f59e0b" font-size="9" font-weight="700">PENTEST</text>
  </svg>`,
  zeroTrustFlow: `<svg class="triad-svg triad-svg-banner" viewBox="0 0 360 155" fill="none" aria-hidden="true">
    <g stroke="#38bdf8" stroke-width="1.5" class="triad-dash-flow">
      <line x1="40" y1="22" x2="155" y2="78"/><line x1="40" y1="50" x2="155" y2="78"/><line x1="40" y1="78" x2="155" y2="78"/><line x1="40" y1="106" x2="155" y2="78"/><line x1="40" y1="134" x2="155" y2="78"/>
      <line x1="205" y1="78" x2="310" y2="78" stroke="#10b981" stroke-width="2"/>
    </g>
    <circle cx="40" cy="22" r="5" fill="#38bdf8"/><circle cx="40" cy="50" r="5" fill="#38bdf8"/><circle cx="40" cy="78" r="5" fill="#38bdf8"/><circle cx="40" cy="106" r="5" fill="#38bdf8"/><circle cx="40" cy="134" r="5" fill="#38bdf8"/>
    <rect x="148" y="46" width="64" height="64" rx="14" fill="#0f172a" stroke="#00f0ff" stroke-width="2"/><text x="160" y="75" fill="#00f0ff" font-size="9" font-weight="800">VERIFY</text><text x="161" y="89" fill="#94a3b8" font-size="8">ENGINE</text>
    <rect x="278" y="54" width="58" height="48" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.8"/><text x="288" y="82" fill="#6ee7b7" font-size="10" font-weight="700">ALLOW</text>
  </svg>`,
  roadmapPipe: `<svg class="triad-svg triad-svg-pipe" viewBox="0 0 640 72" fill="none" aria-hidden="true">
    <line x1="60" y1="36" x2="580" y2="36" stroke="#1e293b" stroke-width="4" stroke-linecap="round"/>
    <line x1="60" y1="36" x2="580" y2="36" stroke="#00f0ff" stroke-width="2.5" class="triad-dash-flow"/>
    <circle cx="60" cy="36" r="18" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/><text x="53" y="40" fill="#fff" font-size="10" font-weight="700">01</text>
    <circle cx="233" cy="36" r="18" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/><text x="226" y="40" fill="#fff" font-size="10" font-weight="700">02</text>
    <circle cx="406" cy="36" r="18" fill="#0f172a" stroke="#00f0ff" stroke-width="2"/><text x="399" y="40" fill="#fff" font-size="10" font-weight="700">03</text>
    <circle cx="580" cy="36" r="18" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="573" y="40" fill="#6ee7b7" font-size="10" font-weight="700">04</text>
  </svg>`,
  contactBeacon: `<svg class="triad-svg triad-svg-beacon" viewBox="0 0 200 160" fill="none" aria-hidden="true">
    <circle cx="100" cy="80" r="18" stroke="#00f0ff" stroke-width="1.5" class="triad-ripple-1"/>
    <circle cx="100" cy="80" r="18" stroke="#38bdf8" stroke-width="1.5" class="triad-ripple-2"/>
    <circle cx="100" cy="80" r="18" stroke="#10b981" stroke-width="1.5" class="triad-ripple-3"/>
    <circle cx="100" cy="80" r="22" fill="#0f172a" stroke="#00f0ff" stroke-width="2"/>
    <path d="M92 80 L98 86 L109 74" stroke="#00f0ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
};

export function triadDesigns(material, { appUrl = '', assetsUrl = '', preview = false } = {}) {
  const renderers = {};
  const sections = material.sections || [];
  const presenters = material.presenters || [];

  for (const s of material.slides) {
    const secIndex = sections.findIndex(c => c.id === s.chapter);
    const section = sections[secIndex];

    const header = `
      <div class="triad-grid-bg" aria-hidden="true"></div>
      <div class="heading">
        <span class="triad-eyebrow"><span class="triad-pulse-dot"></span>${escape(s.lead || section?.title || 'TRIAD PRO-TX SIBER')}</span>
        <h1>${escape(s.title)}</h1>
      </div>
    `;

    let html = '';

    if (s.kind === 'triad-cover') {
      html = `
        <div class="triad-grid-bg" aria-hidden="true"></div>
        <div class="triad-cover-split">
          <div class="triad-cover-container">
            <span class="triad-eyebrow"><span class="triad-pulse-dot"></span>${escape(s.lead)}</span>
            <h1 class="triad-brand-title">TRIAD PRO-TX<br><span style="color: var(--triad-cyan)">SIBER</span></h1>
            <p class="triad-brand-sub">“Transforming IT and Cyber complexity into Strategic Clarity that unlocks Value — enabled by experience.”</p>
            <div class="triad-pillars-banner">
              <span class="triad-pill-item">ISMS ISO/IEC 27001</span>
              <span class="triad-pill-item">ANSI/TIA-942C Data Center</span>
              <span class="triad-pill-item">Penetration Testing & Red Teaming</span>
              <span class="triad-pill-item">Zero Trust Architecture</span>
              <span class="triad-pill-item">IT Governance & Compliance</span>
            </div>
          </div>
          ${SVG.coverRadar}
        </div>
      `;
    } else if (s.kind === 'triad-guide') {
      html = `
        ${header}
        <div class="triad-cards-grid">
          <article class="triad-card">
            <span class="triad-card-badge">01 / NAVIGATION</span>
            <h2>Keyboard Controls</h2>
            <p>Gunakan tombol panah keyboard atau spasi untuk berpindah slide dengan cepat.</p>
            <ul class="triad-card-bullets">
              <li>Tombol <kbd>←</kbd> / <kbd>→</kbd> : Navigasi slide</li>
              <li>Tombol <kbd>F</kbd> : Masuk / keluar Fullscreen presentation</li>
              <li>Tombol <kbd>C</kbd> : Buka Contents / daftar rute materi</li>
            </ul>
          </article>
          <article class="triad-card">
            <span class="triad-card-badge">02 / TOUCH & MOBILE</span>
            <h2>Swipe Navigation</h2>
            <p>Pada perangkat tablet atau smartphone, cukup usap (swipe) layar ke kiri dan kanan.</p>
            <ul class="triad-card-bullets">
              <li>Swipe ke kiri untuk slide berikutnya</li>
              <li>Buka bilah touch kontrol di bagian bawah layar</li>
              <li>Mode tampilan responsif otomatis menyesuaikan layar</li>
            </ul>
          </article>
          <article class="triad-card">
            <span class="triad-card-badge">03 / REGULATORY DRAWER</span>
            <h2>Behind the Defense</h2>
            <p>Tekan tombol "Notes & sources" di bilah atas untuk melihat detail regulasi & referensi standar.</p>
            <ul class="triad-card-bullets">
              <li>Korelasi UU PDP No. 27/2022 & POJK 11/2022</li>
              <li>Mapping klausul ISO 27001:2022</li>
              <li>Kredit platform & catatan arsitektur</li>
            </ul>
          </article>
        </div>
      `;
    } else if (s.kind === 'triad-about') {
      html = `
        ${header}
        <div class="triad-cards-grid" style="grid-template-columns: 1.15fr 1fr;">
          <article class="triad-card">
            <span class="triad-card-badge">MISSION & INTEGRITY</span>
            <h2>Digital Trust Enabler</h2>
            <p><strong>TRIAD PRO-TX SIBER</strong> memastikan integritas dan keandalan informasi digital Anda, mendorong transformasi yang aman, dan membangun kepercayaan kokoh dengan klien Anda.</p>
            ${SVG.aboutTriad}
          </article>
          <article class="triad-card">
            <span class="triad-card-badge">TWO STRATEGIC PILLARS</span>
            <h2>Assurance & Consulting</h2>
            <ul class="triad-card-bullets">
              <li><strong>Assurance Services:</strong> Audit ISMS ISO 27001, Data Center Performance Audit ANSI/TIA-942C, Vulnerability Assessment, Pen Testing & Red Teaming.</li>
              <li><strong>Consulting Services:</strong> Zero Trust Architecture Consulting, Cyber Security Development Program, IT Strategy, & Executive Training.</li>
            </ul>
          </article>
        </div>
      `;
    } else if (s.kind === 'triad-team') {
      html = `
        ${header}
        <div class="triad-team-grid">
          ${presenters.map((p, idx) => `
            <article class="triad-team-card">
              <div class="triad-team-avatar">${p.name.charAt(0)}</div>
              <div>
                <span class="triad-card-badge">EXPERT 0${idx + 1}</span>
                <h3 class="triad-team-name">${escape(p.name)}</h3>
                <p class="triad-team-role">${escape(p.role)}</p>
              </div>
              <ul class="triad-card-bullets" style="margin-top: 8px;">
                ${(p.experience || []).map(exp => `<li>${escape(exp)}</li>`).join('')}
              </ul>
              <div class="triad-team-cred">${escape(p.credentialsShort || p.credentials.join(' · '))}</div>
            </article>
          `).join('')}
        </div>
      `;
    } else if (s.kind === 'triad-credentials') {
      html = `
        ${header}
        <div class="triad-cards-grid">
          <article class="triad-card">
            <span class="triad-card-badge">STANDARDS BENCHMARK</span>
            <h2>International Standards</h2>
            <ul class="triad-card-bullets">
              <li><strong>ISO/IEC 27001:2022:</strong> Information Security Management Systems (ISMS)</li>
              <li><strong>ANSI/TIA-942C:</strong> Telecommunications Infrastructure Standard for Data Centers</li>
              <li><strong>NIST Cybersecurity Framework:</strong> Identify, Protect, Detect, Respond, Recover</li>
              <li><strong>CIS Critical Security Controls:</strong> Top 18 defensive technical controls</li>
            </ul>
          </article>
          <article class="triad-card">
            <span class="triad-card-badge">NATIONAL COMPLIANCE</span>
            <h2>Indonesian Regulatory Alignment</h2>
            <ul class="triad-card-bullets">
              <li><strong>UU No. 27 Tahun 2022:</strong> Pelindungan Data Pribadi (UU PDP)</li>
              <li><strong>POJK No. 11/POJK.03/2022:</strong> Penyelenggaraan Teknologi Informasi Bank Umum</li>
              <li><strong>SEOJK No. 29/SEOJK.03/2022:</strong> Ketahanan dan Keamanan Siber Perbankan</li>
              <li><strong>Indeks KAMI BSSN v5.0:</strong> Kesiapan Keamanan Informasi Nasional</li>
            </ul>
          </article>
          <article class="triad-card">
            <span class="triad-card-badge">OUR COMMITMENT</span>
            <h2>Actionable Rigour</h2>
            <p>Setiap rekomendasi dan temuan audit tidak berhenti pada lembar laporan, melainkan diterjemahkan menjadi <strong>remediation roadmap</strong> yang realistis, efisien biaya, dan dapat dipertanggungjawabkan di hadapan dewan direksi maupun regulator.</p>
          </article>
        </div>
      `;
    } else if (s.kind === 'triad-agenda') {
      html = `
        ${header}
        <div class="triad-cards-grid">
          ${sections.map((sec, i) => `
            <article class="triad-card">
              <span class="triad-card-badge">CHAPTER 0${i + 1}</span>
              <h2>${escape(sec.title)}</h2>
              <p>${escape(sec.caption)}</p>
            </article>
          `).join('')}
        </div>
      `;
    } else if (s.kind === 'triad-section') {
      html = `
        <div class="triad-grid-bg" aria-hidden="true"></div>
        <div class="triad-cover-container" style="text-align: left;">
          <span class="triad-eyebrow"><span class="triad-pulse-dot"></span>${escape(s.lead)}</span>
          <h1 class="triad-brand-title" style="font-size: clamp(42px, 5vw, 76px);">${escape(s.title)}</h1>
          <p class="triad-brand-sub">${escape(section?.caption || '')}</p>
        </div>
      `;
    } else if (s.kind === 'triad-threat') {
      html = `
        ${header}
        ${SVG.threatSurface}
        <div class="triad-cards-grid">
          <article class="triad-card">
            <span class="triad-card-badge">SURFACE RISK</span>
            <h2>Ransomware & Extortion</h2>
            <p>Evolusi ancaman tidak lagi sekadar enkripsi data lokal, melainkan pemerasan berulang (double/triple extortion) dengan ancaman kebocoran data sensitif ke publik.</p>
          </article>
          <article class="triad-card">
            <span class="triad-card-badge">OPERATIONAL RISK</span>
            <h2>Supply Chain Vulnerability</h2>
            <p>Integrasi pihak ketiga, vendor API, dan SaaS eksternal menjadi celah infiltrasi utama yang sering luput dari perimeter keamanan internal konvensional.</p>
          </article>
          <article class="triad-card">
            <span class="triad-card-badge">HUMAN RISK</span>
            <h2>Targeted Social Engineering</h2>
            <p>Eksploitasi kredensial melalui spear-phishing berpresisi tinggi berbasis AI dan rekayasa identitas yang menargetkan pemegang otoritas finansial dan sistem.</p>
          </article>
        </div>
      `;
    } else if (s.kind === 'triad-regulation') {
      html = `
        ${header}
        ${SVG.complianceHub}
        <div class="triad-cards-grid">
          <article class="triad-card">
            <span class="triad-card-badge">UU PDP NO. 27 TAHUN 2022</span>
            <h2>Sanksi Denda & Pidana</h2>
            <p>Sanksi administratif mencapai <strong>2% dari total pendapatan tahunan</strong>, kewajiban penunjukan Pejabat PDP (DPO), serta ancaman pidana penjara bagi pengungkapan atau pemalsuan data pribadi.</p>
          </article>
          <article class="triad-card">
            <span class="triad-card-badge">POJK 11 & SEOJK 29/2022</span>
            <h2>Mandatori Ketahanan Siber</h2>
            <p>Kewajiban kepemilikan Cyber Security Incident Response Team (CSIRT), penetration testing periodik, penilaian berkala maturitas keamanan, dan pelaporan insiden dalam tempo ketat.</p>
          </article>
          <article class="triad-card">
            <span class="triad-card-badge">INDEKS KAMI & ISO 27001:2022</span>
            <h2>Pembuktian Kepatuhan Terukur</h2>
            <p>Evaluasi 5 area kontrol: Tata Kelola, Pengelolaan Risiko, Kerangka Kerja Keamanan, Pengelolaan Aset Informasi, dan Teknologi/Operasi Pengamanan.</p>
          </article>
        </div>
      `;
    } else if (s.kind === 'triad-service-card') {
      const svcSvg = s.key === 'triad-iso-audit' ? SVG.isoScan : s.key === 'triad-datacenter-audit' ? SVG.dcRack : s.key === 'triad-pentest' ? SVG.pentestTarget : '';
      html = `
        ${header}
        <div class="triad-cards-grid" style="grid-template-columns: 1.1fr 1fr;">
          <article class="triad-card">
            <span class="triad-card-badge">SERVICE OVERVIEW</span>
            <div class="triad-service-head">
              ${svcSvg}
              <div>
                <h2>Ruang Lingkup & Metodologi</h2>
                <p style="margin-top: 10px;">${escape(s.notes)}</p>
              </div>
            </div>
          </article>
          <article class="triad-card">
            <span class="triad-card-badge">DELIVERABLES</span>
            <h2>Deliverables Kunci</h2>
            <ul class="triad-card-bullets">
              <li>Laporan Executive Summary untuk Board of Directors / C-Level</li>
              <li>Technical Gap & Vulnerability Assessment Report terperinci</li>
              <li>Prioritized Remediation Roadmap berbasis risiko riil</li>
              <li>Sertifikat / Statement of Readiness resmi dari TRIAD PRO-TX SIBER</li>
            </ul>
          </article>
        </div>
      `;
    } else if (s.kind === 'triad-zero-trust-slide') {
      html = `
        ${header}
        ${SVG.zeroTrustFlow}
        <div class="triad-zt-pillars">
          <div class="triad-zt-node">
            <span class="triad-card-badge">01</span>
            <strong>Identity</strong>
            <span>Continuous MFA, Risk-based access, Least Privilege</span>
          </div>
          <div class="triad-zt-node">
            <span class="triad-card-badge">02</span>
            <strong>Device</strong>
            <span>Endpoint compliance, Health attestation, EDR</span>
          </div>
          <div class="triad-zt-node">
            <span class="triad-card-badge">03</span>
            <strong>Network</strong>
            <span>Micro-segmentation, Encrypted transit, Zero Implicit Trust</span>
          </div>
          <div class="triad-zt-node">
            <span class="triad-card-badge">04</span>
            <strong>Workload</strong>
            <span>Container security, DevSecOps pipeline, Runtime protection</span>
          </div>
          <div class="triad-zt-node">
            <span class="triad-card-badge">05</span>
            <strong>Data</strong>
            <span>Classification, DLP, Strong Encryption at rest & in transit</span>
          </div>
        </div>
        <div class="triad-card" style="margin-top: 24px;">
          <span class="triad-card-badge">TRANSFORMATION BLUEPRINT</span>
          <h2>Zero Trust Consulting by TRIAD PRO-TX SIBER</h2>
          <p>Kami memandu organisasi Anda bertransisi dari perimeter keamanan tradisional berbasis firewall menuju arsitektur <em>Zero Trust</em> yang tangguh, adaptif, dan siap menghadapi ancaman masa kini.</p>
        </div>
      `;
    } else if (s.kind === 'triad-roadmap-slide') {
      html = `
        ${header}
        ${SVG.roadmapPipe}
        <div class="triad-cards-grid" style="grid-template-columns: repeat(4, 1fr);">
          <article class="triad-card">
            <span class="triad-card-badge">PHASE 01</span>
            <h2>Discovery</h2>
            <p>Kick-off, scoping batas sistem, pengumpulan dokumentasi kebijakan, dan inventarisasi aset digital.</p>
          </article>
          <article class="triad-card">
            <span class="triad-card-badge">PHASE 02</span>
            <h2>Fieldwork</h2>
            <p>Pelaksanaan audit kontrol (ISO 27001 / ANSI TIA-942C), ethical penetration testing, dan wawancara operasional.</p>
          </article>
          <article class="triad-card">
            <span class="triad-card-badge">PHASE 03</span>
            <h2>Reporting</h2>
            <p>Konsolidasi temuan 5C (Condition, Criteria, Cause, Consequence, Corrective Action) dan roadmap perbaikan.</p>
          </article>
          <article class="triad-card">
            <span class="triad-card-badge">PHASE 04</span>
            <h2>Assurance</h2>
            <p>Verifikasi remediasi, asistensi penutupan temuan, dan readiness sertifikasi pihak ketiga.</p>
          </article>
        </div>
      `;
    } else if (s.kind === 'triad-contact-slide') {
      html = `
        ${header}
        <div class="triad-contact-box">
          <div>
            <span class="triad-eyebrow"><span class="triad-pulse-dot"></span>GET IN TOUCH</span>
            <h2 style="font-size: 32px; font-weight: 800; color: #fff; margin: 0 0 16px;">Amankan Ekosistem Digital Organisasi Anda Hari Ini</h2>
            <p style="color: var(--triad-muted); font-size: 16px; line-height: 1.6; margin: 0 0 24px;">Diskusikan kebutuhan audit kepatuhan, pengujian keamanan siber (penetration testing), atau transformasi arsitektur Zero Trust bersama tim ahli TRIAD PRO-TX SIBER.</p>
            <div style="display: flex; gap: 16px; flex-wrap: wrap;">
              <a class="triad-btn-action" href="https://wa.me/6282254203272" target="_blank" rel="noreferrer">
                <span>💬 Hubungi via WhatsApp</span>
              </a>
              <a class="triad-btn-action" href="mailto:triad-proteksiber@pm.me" style="background: rgba(56, 189, 248, 0.15); color: var(--triad-sky); border: 1px solid rgba(56, 189, 248, 0.3);">
                <span>✉ triad-proteksiber@pm.me</span>
              </a>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 16px; justify-content: center; border-left: 1px solid rgba(56, 189, 248, 0.18); padding-left: 30px;">
            ${SVG.contactBeacon}
            <div>
              <span class="triad-card-badge">OFFICIAL DOMAIN</span>
              <p style="font-size: 18px; font-weight: 700; color: #fff; margin: 4px 0 0;"><a href="https://eranusasiber.my.id" target="_blank" rel="noreferrer" style="color: var(--triad-cyan); text-decoration: underline;">eranusasiber.my.id</a></p>
            </div>
            <div>
              <span class="triad-card-badge">HEADQUARTERS</span>
              <p style="font-size: 15px; color: var(--triad-muted); margin: 4px 0 0;">Jakarta / Indonesia · Serving National & Regional Enterprises</p>
            </div>
            <div>
              <span class="triad-card-badge">DIRECT HOTLINE</span>
              <p style="font-size: 15px; color: var(--triad-muted); margin: 4px 0 0;">+62 822-5420-3272</p>
            </div>
          </div>
        </div>
      `;
    }

    renderers[s.key] = {
      title: s.title,
      tone: 'night',
      kind: 'triad-frame ' + (s.kind || ''),
      html
    };
  }

  const entries = material.slides.map((s, i) => ({
    key: s.key,
    chapter: s.chapter,
    index: i + 1,
    title: s.title,
    section: s.lead || 'TRIAD PRO-TX SIBER',
    note: s.notes || '',
    links: []
  }));

  return {
    renderers,
    entries
  };
}
