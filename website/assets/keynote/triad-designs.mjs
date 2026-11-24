// TRIAD PRO-TX SIBER Dynamic Presentation Module Engine
const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

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
        <div class="triad-cards-grid" style="grid-template-columns: 1.2fr 1fr;">
          <article class="triad-card">
            <span class="triad-card-badge">MISSION & INTEGRITY</span>
            <h2>Digital Trust Enabler</h2>
            <p><strong>TRIAD PRO-TX SIBER</strong> memastikan integritas dan keandalan informasi digital Anda, mendorong transformasi yang aman, dan membangun kepercayaan kokoh dengan klien Anda.</p>
            <p>Tim ahli kami menyediakan layanan assurance dan konsultasi berstandar global yang disesuaikan secara presisi dengan kebutuhan teknologi, komunikasi, dan lanskap bisnis organisasi Anda.</p>
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
      html = `
        ${header}
        <div class="triad-cards-grid" style="grid-template-columns: 1.1fr 1fr;">
          <article class="triad-card">
            <span class="triad-card-badge">SERVICE OVERVIEW</span>
            <h2>Ruang Lingkup & Metodologi</h2>
            <p>${escape(s.notes)}</p>
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
