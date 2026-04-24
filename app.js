<!-- /app.js -->
const SUPABASE_URL = 'https://bsguhatzcxrxascrjqij.supabase.co';
const SUPABASE_KEY = 'sb_publishable_DQWcwhp5lYJIOdIXRpJtEA_Ltpq3IUQ';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const DEFAULT_TEACHERS = [
  'Pn. Nitya Sree A/P Dorai Singam',
  'Pn. Yogeshwary A/P Subramaniam',
  'Pn. Vejayah A/P Muthiah',
  'Cik. Indirani A/P Subramaniam',
  'Cik. P Thilagaavaty A/P Perumal',
  'En. Mohd Heilmie Bin Hasim',
  'Cik. Loggana A/P Assokumar',
  'Pn. Kanchanaah A/P Rajenthiran',
  'En. Palaganesh A/L Rajendran',
  'Pn. Moganambal Selvi A/P Kunasigaran',
];

const DEFAULT_POSITIONS = [
  'Guru Data & Maklumat Sekolah (EMIS)',
  'Guru ICT / Penyelaras Bestari',
  'Guru Perpustakaan & Media (GPM)',
  'Penyelaras Latihan Dalam Perkhidmatan (LDP / CPD)',
  'Penyelaras SKPM Kualiti@Sekolah',
  'Pegawai Aset Sekolah',
  'Pegawai Pemeriksa Aset & Pelupusan',
  'Penyelaras Program Transformasi Sekolah 2025 (TS25)',
  'Penyelaras Kajian Tindakan & Inovasi',
  'Setiausaha Kurikulum',
  'Setiausaha Peperiksaan Dalaman',
  'Penyelaras Pentaksiran Berasaskan Sekolah (PBS)',
  'Penyelaras Pentaksiran Bilik Darjah (PBD)',
  'Penyelaras Jadual Waktu & Guru Ganti',
  'Ketua Panitia Mata Pelajaran (BM, BI, Matematik, Sains, dll.)',
  'Penyelaras Program NILAM',
  'Penyelaras Pemulihan Khas & ProPIM',
  'Penyelaras KBAT & i-THINK',
  'Penyelaras STEM',
  'Penyelaras Pembangunan Profesionalisme Guru (Professional Learning Community- PLC)',
  'Penyelaras MBMMBI (Memartabatkan Bahasa Malaysia Memperkukuh Bahasa Inggeris)',
  'Penyelaras Program Highly Immersive Programme (HIP)',
  'Penyelaras Program Literasi dan Numerasi (PLaN)',
  'Ketua Panitia Bahasa Melayu',
  'Ketua Panitia Bahasa Tamil',
  'Ketua Panitia Bahasa Inggeris',
  'Ketua Panitia Matematik',
  'Ketua Panitia Sains',
  'Ketua Panitia Pendidikan Moral',
  'Ketua Panitia Sejarah',
  'Ketua Panitia Reka Bentuk dan Teknologi (RBT)',
  'Ketua Panitia Pendidikan Seni Visual',
  'Ketua Panitia Pendidikan Muzik',
  'Ketua Panitia Teknologi Maklumat dan Komunikasi (TMK)',
  'Ketua Panitia Pendidikan Jasmani dan Kesihatan (PJK)',
  'Guru Prasekolah',
  'Guru Kelas Tahun 1',
  'Guru Kelas Tahun 2',
  'Guru Kelas Tahun 3',
  'Guru Kelas Tahun 4',
  'Guru Kelas Tahun 5',
  'Guru Kelas Tahun 6',
];

let GLOBAL_RUJ = 'CBD3047.100.6/1/3( )';

let headerSettings = {
  id: null,
  leftLogo: '',
  rightLogo: '',
  schoolEmail: 'cbd3047@moe.edu.my',
  note: '',
  principalName: 'JEYAKANTAN PATHMANABAN',
};

const state = {
  teachers: [],
  positions: [],
  letters: {},
};

const el = (id) => document.getElementById(id);

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatMalayDate(iso) {
  if (!iso) return '';
  const months = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function roman(num) {
  const values = ['', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii', 'xiii', 'xiv', 'xv', 'xvi', 'xvii', 'xviii', 'xix', 'xx', 'xxi', 'xxii'];
  return values[num] || `${num}.`;
}

function showError(error, fallback = 'Ralat tidak diketahui.') {
  console.error(error);
  alert(error?.message || fallback);
}

function setButtonsDisabled(disabled) {
  document.querySelectorAll('button').forEach((button) => {
    button.disabled = disabled;
  });
}

async function seedDefaultsIfNeeded() {
  const { data: teacherRows, error: teacherError } = await supabaseClient
    .from('teachers')
    .select('name')
    .limit(1);

  if (teacherError) throw teacherError;

  if (!teacherRows.length) {
    const { error } = await supabaseClient
      .from('teachers')
      .upsert(DEFAULT_TEACHERS.map((name) => ({ name })), { onConflict: 'name' });

    if (error) throw error;
  }

  const { data: positionRows, error: positionError } = await supabaseClient
    .from('positions')
    .select('name')
    .limit(1);

  if (positionError) throw positionError;

  if (!positionRows.length) {
    const { error } = await supabaseClient
      .from('positions')
      .upsert(DEFAULT_POSITIONS.map((name) => ({ name })), { onConflict: 'name' });

    if (error) throw error;
  }
}

async function loadRemoteData() {
  const [
    headerResult,
    teachersResult,
    positionsResult,
    lettersResult,
  ] = await Promise.all([
    supabaseClient
      .from('header_settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabaseClient
      .from('teachers')
      .select('name')
      .order('name', { ascending: true }),
    supabaseClient
      .from('positions')
      .select('name')
      .order('name', { ascending: true }),
    supabaseClient
      .from('letters')
      .select('*')
      .order('teacher_name', { ascending: true }),
  ]);

  if (headerResult.error) throw headerResult.error;
  if (teachersResult.error) throw teachersResult.error;
  if (positionsResult.error) throw positionsResult.error;
  if (lettersResult.error) throw lettersResult.error;

  const headerRow = headerResult.data;
  if (headerRow) {
    headerSettings = {
      id: headerRow.id,
      leftLogo: headerRow.left_logo || '',
      rightLogo: headerRow.right_logo || '',
      schoolEmail: headerRow.school_email || 'cbd3047@moe.edu.my',
      note: headerRow.note || '',
      principalName: headerRow.principal_name || 'JEYAKANTAN PATHMANABAN',
    };
  }

  state.teachers = (teachersResult.data || []).map((row) => row.name);
  state.positions = (positionsResult.data || []).map((row) => row.name);
  state.letters = {};

  (lettersResult.data || []).forEach((row) => {
    state.letters[row.teacher_name] = {
      teacher: row.teacher_name,
      tarikhSurat: row.tarikh_surat || '',
      tahunBuku: row.tahun_buku || '',
      sesiAkademik: row.sesi_akademik || '',
      tajukSurat: row.tajuk_surat || '',
      tarikhMula: row.tarikh_mula || '',
      tarikhHingga: row.tarikh_hingga || '',
      positions: Array.isArray(row.positions) ? row.positions : [],
      rujKami: row.ruj_kami || 'CBD3047.100.6/1/3( )',
    };
  });

  const anyLetter = Object.values(state.letters)[0];
  if (anyLetter?.rujKami) {
    GLOBAL_RUJ = anyLetter.rujKami;
  }
}

async function initApp() {
  try {
    setButtonsDisabled(true);
    await seedDefaultsIfNeeded();
    await loadRemoteData();
    renderAll();
    updateLogoPreviews();
    el('tarikhSurat').value = todayISO();
    el('tarikhMula').value = todayISO();
    el('rujKami').value = GLOBAL_RUJ;
  } catch (error) {
    showError(error, 'Gagal memuatkan data dari Supabase.');
  } finally {
    setButtonsDisabled(false);
  }
}

function updateLogoPreviews() {
  const left = el('logoLeftPreview');
  const right = el('logoRightPreview');

  left.src = headerSettings.leftLogo || '';
  right.src = headerSettings.rightLogo || '';
  left.style.display = headerSettings.leftLogo ? 'block' : 'none';
  right.style.display = headerSettings.rightLogo ? 'block' : 'none';

  el('schoolEmail').value = headerSettings.schoolEmail || 'cbd3047@moe.edu.my';
  el('headerNote').value = headerSettings.note || '';
  el('principalName').value = headerSettings.principalName || 'JEYAKANTAN PATHMANABAN';
}

function handleLogoUpload(file, side) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function () {
    headerSettings[side] = reader.result;
    updateLogoPreviews();
  };
  reader.readAsDataURL(file);
}

async function saveHeaderSettings(showAlert = true) {
  headerSettings.schoolEmail = el('schoolEmail').value.trim() || 'cbd3047@moe.edu.my';
  headerSettings.note = el('headerNote').value.trim();
  headerSettings.principalName = el('principalName').value.trim() || 'JEYAKANTAN PATHMANABAN';

  const payload = {
    school_email: headerSettings.schoolEmail,
    note: headerSettings.note,
    principal_name: headerSettings.principalName,
    left_logo: headerSettings.leftLogo,
    right_logo: headerSettings.rightLogo,
    updated_at: new Date().toISOString(),
  };

  let result;
  if (headerSettings.id) {
    result = await supabaseClient
      .from('header_settings')
      .update(payload)
      .eq('id', headerSettings.id)
      .select()
      .single();
  } else {
    result = await supabaseClient
      .from('header_settings')
      .insert(payload)
      .select()
      .single();
  }

  if (result.error) throw result.error;

  headerSettings.id = result.data.id;
  updateLogoPreviews();

  if (showAlert) {
    alert('Tetapan header berjaya disimpan.');
  }
}

async function clearHeaderSettings() {
  if (!confirm('Padam semua tetapan logo/header?')) return;

  headerSettings = {
    id: headerSettings.id,
    leftLogo: '',
    rightLogo: '',
    schoolEmail: 'cbd3047@moe.edu.my',
    note: '',
    principalName: 'JEYAKANTAN PATHMANABAN',
  };

  el('logoLeftInput').value = '';
  el('logoRightInput').value = '';
  await saveHeaderSettings(false);
  alert('Tetapan header telah direset.');
}

function showTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  document.querySelectorAll('.panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === tabId);
  });
}

function teacherOptionsHTML(selected = '') {
  const options = ['<option value="">-- Pilih guru --</option>'];
  [...state.teachers].sort().forEach((name) => {
    options.push(`<option value="${escapeHtml(name)}" ${name === selected ? 'selected' : ''}>${escapeHtml(name)}</option>`);
  });
  return options.join('');
}

function renderTeacherDropdowns(selected = '') {
  el('teacherSelect').innerHTML = teacherOptionsHTML(selected);
  el('printTeacherSelect').innerHTML = teacherOptionsHTML(selected);
}

function getPositionCheckboxes() {
  return Array.from(document.querySelectorAll('#positionCheckboxContainer input[type="checkbox"]'));
}

function getSelectedPositions() {
  return getPositionCheckboxes()
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

function renderPositions(selectedPositions) {
  const container = el('positionCheckboxContainer');
  const current = Array.isArray(selectedPositions) ? selectedPositions : getSelectedPositions();

  container.innerHTML = [...state.positions]
    .sort()
    .map((pos) => {
      const id = `pos_${Math.random().toString(36).slice(2, 11)}`;
      const checked = current.includes(pos) ? 'checked' : '';
      return `<div class="position-item">
        <input type="checkbox" id="${id}" value="${escapeHtml(pos)}" ${checked}>
        <label for="${id}">${escapeHtml(pos)}</label>
      </div>`;
    })
    .join('');

  getPositionCheckboxes().forEach((checkbox) => {
    checkbox.addEventListener('change', renderSelectedTeacherPositions);
  });
}

function selectAllPositions() {
  getPositionCheckboxes().forEach((checkbox) => {
    checkbox.checked = true;
  });
  renderSelectedTeacherPositions();
}

function clearAllPositions() {
  getPositionCheckboxes().forEach((checkbox) => {
    checkbox.checked = false;
  });
  renderSelectedTeacherPositions();
}

function renderSelectedTeacherPositions() {
  const values = getSelectedPositions();
  el('selectedTeacherPositions').innerHTML = values.length
    ? values.map((position) => `<span class="pill">${escapeHtml(position)}</span>`).join('')
    : '<span class="muted">Belum ada jawatan dipilih.</span>';
}

async function ensureTeacher(name) {
  const clean = (name || '').trim();
  if (!clean) return '';

  if (!state.teachers.includes(clean)) {
    const { error } = await supabaseClient
      .from('teachers')
      .upsert({ name: clean }, { onConflict: 'name' });

    if (error) throw error;
    state.teachers.push(clean);
  }

  return clean;
}

async function ensurePositions(list) {
  const cleanList = list
    .map((pos) => String(pos || '').trim())
    .filter(Boolean);

  if (!cleanList.length) return;

  const { error } = await supabaseClient
    .from('positions')
    .upsert(cleanList.map((name) => ({ name })), { onConflict: 'name' });

  if (error) throw error;

  cleanList.forEach((name) => {
    if (!state.positions.includes(name)) {
      state.positions.push(name);
    }
  });
}

function clearForm(keepTeacher = false) {
  const teacher = keepTeacher ? el('teacherSelect').value : '';
  el('rujKami').value = GLOBAL_RUJ;
  el('tarikhSurat').value = todayISO();
  el('tahunBuku').value = '';
  el('sesiAkademik').value = '';
  el('tajukSurat').value = 'PERLANTIKAN SEBAGAI JAWATANKUASA UNIT PENGURUSAN KURIKULUM DAN PENTADBIRAN SEKOLAH JENIS KEBANGSAAN (TAMIL) KUALA LIPIS';
  el('tarikhMula').value = todayISO();
  el('tarikhHingga').value = '';
  el('newPositionText').value = '';
  renderTeacherDropdowns(teacher);
  renderPositions([]);
  renderSelectedTeacherPositions();
}

function fillFormFromRecord(name) {
  renderTeacherDropdowns(name);
  const rec = state.letters[name];
  el('rujKami').value = GLOBAL_RUJ;

  if (!rec) {
    renderPositions([]);
    renderSelectedTeacherPositions();
    return;
  }

  GLOBAL_RUJ = rec.rujKami || GLOBAL_RUJ;
  el('rujKami').value = GLOBAL_RUJ;
  el('tarikhSurat').value = rec.tarikhSurat || todayISO();
  el('tahunBuku').value = rec.tahunBuku || '';
  el('sesiAkademik').value = rec.sesiAkademik || '';
  el('tajukSurat').value = rec.tajukSurat || 'PERLANTIKAN SEBAGAI JAWATANKUASA UNIT PENGURUSAN KURIKULUM DAN PENTADBIRAN SEKOLAH JENIS KEBANGSAAN (TAMIL) KUALA LIPIS';
  el('tarikhMula').value = rec.tarikhMula || '';
  el('tarikhHingga').value = rec.tarikhHingga || '';
  renderPositions(rec.positions || []);
  renderSelectedTeacherPositions();
}

async function saveCurrentRecord() {
  let teacher = el('teacherSelect').value;

  if (!teacher && el('newTeacherName').value.trim()) {
    teacher = await ensureTeacher(el('newTeacherName').value.trim());
  }

  if (!teacher) {
    alert('Sila pilih atau tambah nama guru terlebih dahulu.');
    return;
  }

  GLOBAL_RUJ = el('rujKami').value.trim() || 'CBD3047.100.6/1/3( )';

  const record = {
    teacher,
    tarikhSurat: el('tarikhSurat').value,
    tahunBuku: el('tahunBuku').value.trim(),
    sesiAkademik: el('sesiAkademik').value.trim(),
    tajukSurat: el('tajukSurat').value.trim(),
    tarikhMula: el('tarikhMula').value,
    tarikhHingga: el('tarikhHingga').value,
    positions: getSelectedPositions(),
    rujKami: GLOBAL_RUJ,
  };

  await ensureTeacher(teacher);
  await ensurePositions(record.positions);

  const { error } = await supabaseClient
    .from('letters')
    .upsert({
      teacher_name: record.teacher,
      tarikh_surat: record.tarikhSurat || null,
      tahun_buku: record.tahunBuku,
      sesi_akademik: record.sesiAkademik,
      tajuk_surat: record.tajukSurat,
      tarikh_mula: record.tarikhMula || null,
      tarikh_hingga: record.tarikhHingga || null,
      ruj_kami: record.rujKami,
      positions: record.positions,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'teacher_name' });

  if (error) throw error;

  state.letters[teacher] = record;
  renderAll();
  renderTeacherDropdowns(teacher);
  fillFormFromRecord(teacher);
  el('newTeacherName').value = '';
  alert('Rekod guru berjaya disimpan / dikemaskini.');
}

function buildPositionsHTML(list) {
  if (!(list || []).length) {
    return '<div class="roman-row"><span class="roman-span">i.</span><span>-</span></div>';
  }

  return list
    .map((position, index) => `<div class="roman-row"><span class="roman-span">${roman(index + 1)}.</span><span>${escapeHtml(position)}</span></div>`)
    .join('');
}

function getLeftLogoHTML() {
  return headerSettings.leftLogo
    ? `<img src="${headerSettings.leftLogo}" alt="Logo kiri">`
    : '<div style="width:78px;height:88px;border:1px solid #777;font-size:10px;display:flex;align-items:center;justify-content:center;text-align:center;">LOGO KIRI</div>';
}

function getRightLogoHTML() {
  return headerSettings.rightLogo
    ? `<img src="${headerSettings.rightLogo}" alt="Logo kanan">`
    : '<div style="width:78px;height:88px;border:1px solid #777;font-size:10px;display:flex;align-items:center;justify-content:center;text-align:center;">LOGO SEKOLAH</div>';
}

function generateLetterHTML(rec) {
  const positions = buildPositionsHTML(rec.positions || []);
  const teacherUpper = (rec.teacher || '').toUpperCase();
  const principalName = headerSettings.principalName || 'JEYAKANTAN PATHMANABAN';

  return `<div class="page">
    <div class="box">
      <div class="header">
        <div class="logo-left">${getLeftLogoHTML()}</div>
        <div class="header-center">
          <div class="kpm">KEMENTERIAN PENDIDIKAN MALAYSIA</div>
          <div class="school">SEKOLAH JENIS KEBANGSAAN (TAMIL) KUALA LIPIS</div>
          <div class="addr">27200 Kuala Lipis</div>
          <div class="addr">Pahang Darul Makmur</div>
          <div class="small-meta">Tel/Faks : 09-3125150</div>
          <div class="small-meta">Email : ${escapeHtml(headerSettings.schoolEmail || 'cbd3047@moe.edu.my')}</div>
        </div>
        <div class="logo-right">${getRightLogoHTML()}</div>
      </div>

      <div class="line"></div>

      <div class="ref-wrap">
        <div>Ruj. Kami: ${escapeHtml(rec.rujKami || GLOBAL_RUJ)}</div>
        <div>Tarikh: ${escapeHtml(formatMalayDate(rec.tarikhSurat))}</div>
      </div>

      <div class="recipient">${escapeHtml(teacherUpper)}<br>Sekolah Jenis Kebangsaan Tamil Kuala Lipis<br>27200 Kuala Lipis,<br>Pahang Darul Makmur</div>
      <div class="tuan">Tuan/Puan,</div>
      <div class="title">${escapeHtml(rec.tajukSurat)}</div>
      <div class="para">Dengan segala hormatnya perkara di atas dirujuk.</div>

      <div class="para numrow">
        <span class="num-span">2.</span>
        <span class="numrow-text">Sukacita dimaklumkan bahawa tuan/puan telah dilantik menganggotai jawatankuasa yang terkandung seperti dalam Buku Pengurusan dan Takwim Sekolah :</span>
      </div>

      <div class="roman-group">${positions}</div>

      <div class="para numrow">
        <span class="num-span">3.</span>
        <span class="numrow-text">Tugas tuan/puan ini berkuat kuasa mulai sesi akademik ${escapeHtml(rec.sesiAkademik || '')}${rec.tarikhMula || rec.tarikhHingga ? `, mulai ${escapeHtml(formatMalayDate(rec.tarikhMula))}${rec.tarikhHingga ? ` hingga ${escapeHtml(formatMalayDate(rec.tarikhHingga))}` : ''}` : ''} dan tertakluk kepada sebarang perubahan daripada pihak pentadbir sekolah dari semasa ke semasa.</span>
      </div>

      <div class="para numrow">
        <span class="num-span">4.</span>
        <span class="numrow-text">Tuan/puan dikehendaki melaksanakan semua tugas yang telah ditetapkan dan mematuhi semua peraturan, prosedur yang menjadi KPI (Key Performance Indicator) KPM. Sukacita juga diingatkan bahawa tugas-tugas yang dipertanggungjawabkan adalah merupakan tugas-tugas rasmi dan diuruskan selari dengan visi dan misi sekolah.</span>
      </div>

      <div class="para numrow">
        <span class="num-span">5.</span>
        <span class="numrow-text">Saya berkeyakinan bahawa tuan/puan mampu melaksanakan tugas dan tanggungjawab yang diamanahkan berdasarkan kebolehan, keupayaan, minat dan komitmen yang ditunjukkan selama ini.</span>
      </div>

      <div class="sekian">Sekian, terima kasih.</div>

      <div class="slogan-group">
        <strong>"MALAYSIA MADANI"</strong><br>
        <strong>"BERKHIDMAT UNTUK NEGARA"</strong><br>
        <strong>"TRANSFORMASI PENDIDIKAN PAHANG"</strong>
      </div>

      <div class="saya">Saya yang menjalankan amanah,</div>
      <div class="signature-gap"></div>
      <div class="signature-line">.....................................................</div>
      <div class="signature-block">
        <strong>(${escapeHtml(principalName)})</strong><br>
        <strong>GURU BESAR</strong><br>
        SJKT KUALA LIPIS
      </div>

      <div class="sk-block">s.k. Fail Pengurusan Kurikulum</div>
    </div>
  </div>`;
}

function buildPreviewHTML(records, autoPrint) {
  const pages = records
    .map((rec, idx) => `<div class="sheet ${idx < records.length - 1 ? 'page-break' : ''}">${generateLetterHTML(rec)}</div>`)
    .join('');

  return `<!doctype html>
<html lang="ms">
<head>
<meta charset="UTF-8">
<title>Preview Surat</title>
<style>
@page{size:A4;margin:11mm 14mm 12mm 14mm}
body{margin:0;background:#e5e7eb;font-family:Arial,sans-serif}
.toolbar{position:sticky;top:0;background:#fff;padding:14px;border-bottom:1px solid #d1d5db;z-index:10}
.toolbar button{padding:10px 12px;border:none;border-radius:8px;font-weight:bold;cursor:pointer;margin-right:8px}
.btn1{background:#0f4c81;color:#fff}
.btn2{background:#e5e7eb;color:#111}
.sheet{display:block;width:100%;background:#fff;max-width:900px;margin:14px auto;box-shadow:0 10px 30px rgba(0,0,0,.08);padding:10px 14px}
.page-break{page-break-after:always;break-after:page}
.page{max-width:780px;margin:0 auto;font-family:"Times New Roman",Times,serif;font-size:10.6pt;color:#000}
.box{border:1px solid #000;padding:24px 28px;box-sizing:border-box}
.header{display:grid;grid-template-columns:90px 1fr 90px;align-items:center;column-gap:18px}
.logo-left,.logo-right{display:flex;align-items:center;justify-content:center}
.logo-left img,.logo-right img{width:88px;height:88px;object-fit:contain}
.header-center{text-align:center;padding:0 10px}
.kpm{font-weight:bold;font-size:12.8pt;line-height:1.0;margin:0 0 2px 0}
.school{font-weight:bold;font-size:11pt;line-height:1.0;margin:0 0 2px 0}
.addr{font-size:10.4pt;line-height:1.15;margin:0}
.small-meta{font-size:8.3pt;line-height:1.0;margin:0}
.line{border-bottom:1px solid #000;margin-top:6px;margin-bottom:2px}
.ref-wrap{text-align:right;font-size:8.5pt;line-height:1.2;width:260px;margin-left:auto;margin-bottom:8px}
.ref-wrap div{margin:0;padding:0;text-indent:0}
.recipient{font-size:10.6pt;line-height:1.15;margin-top:12pt;margin-bottom:12pt}
.tuan{font-size:10.6pt;line-height:1.15;margin-top:0;margin-bottom:12pt}
.title{font-size:10.6pt;line-height:1.15;margin-top:12pt;margin-bottom:12pt;font-weight:bold;text-transform:uppercase;text-align:justify}
.para{font-size:10.6pt;line-height:1.5;margin-top:12pt;margin-bottom:12pt;text-align:justify}
.numrow{display:block}
.num-span{display:inline-block;width:24px}
.numrow-text{display:inline}
.roman-group{margin-left:0.75in;margin-top:0;margin-bottom:12pt}
.roman-row{text-indent:-0.25in;padding-left:0.25in;line-height:1.15;text-align:justify;margin:0}
.roman-span{display:inline-block;width:0.25in}
.sekian{font-size:10.6pt;line-height:1.5;margin-top:0;margin-bottom:18pt;margin-left:0;text-align:left}
.slogan-group{font-size:10.6pt;line-height:1.5;margin-top:0;margin-bottom:0;text-align:left}
.saya{font-size:10.6pt;line-height:1.5;margin-top:24pt;margin-bottom:0;text-align:left}
.signature-gap{height:36px}
.signature-line{margin-left:0;line-height:1.0;text-align:left}
.signature-block{font-size:10.6pt;line-height:1.0;margin-top:0}
.sk-block{font-size:8.6pt;line-height:1.0;font-style:italic;margin-top:24px;margin-left:36px}
@media print{
 body{background:#fff}
 .toolbar{display:none}
 .sheet{margin:0;box-shadow:none;max-width:none;padding:0;background:#fff}
}
</style>
</head>
<body>
<div class="toolbar">
 <button class="btn1" id="btnCetak">Cetak</button>
 <button class="btn2" onclick="window.close()">Tutup</button>
</div>
${pages}
<script>
function autoFitPages(){
 document.querySelectorAll('.page').forEach(function(page){
   let fs=10.6,gap=36,tries=0;
   while(page.scrollHeight>1035&&fs>9.5&&tries<16){
     fs-=0.1;
     gap=Math.max(20,gap-2);
     page.style.fontSize=fs+'pt';
     let sg=page.querySelector('.signature-gap');
     if(sg) sg.style.height=gap+'px';
     tries++;
   }
 });
}
document.getElementById('btnCetak').addEventListener('click',function(){
 window.focus();
 setTimeout(function(){window.print();},300);
});
window.addEventListener('load',function(){
 autoFitPages();
 ${autoPrint ? 'setTimeout(function(){window.print();},500);' : ''}
});
<\/script>
</body>
</html>`;
}

function openPreview(records, autoPrint = false) {
  if (!records.length) {
    alert('Tiada rekod untuk dipreview.');
    return;
  }

  const previewWindow = window.open('', '_blank');
  if (!previewWindow) {
    alert('Pop-up diblokir. Sila benarkan pop-up untuk sistem ini.');
    return;
  }

  previewWindow.document.open();
  previewWindow.document.write(buildPreviewHTML(records, autoPrint));
  previewWindow.document.close();
}

function renderTable() {
  const tbody = el('recordTableBody');
  const query = el('searchTeacher').value.trim().toLowerCase();

  const names = [...state.teachers]
    .sort()
    .filter((name) => !query || name.toLowerCase().includes(query));

  tbody.innerHTML = names.map((name, index) => {
    const rec = state.letters[name] || { positions: [] };
    const safe = name.replace(/'/g, "\\'");
    return `<tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(name)}</td>
      <td>${(rec.positions || []).map((p) => `<span class="pill">${escapeHtml(p)}</span>`).join('')}</td>
      <td>${escapeHtml(rec.tahunBuku || '')}</td>
      <td>${escapeHtml(formatMalayDate(rec.tarikhMula || ''))}${rec.tarikhHingga ? ` - ${escapeHtml(formatMalayDate(rec.tarikhHingga))}` : ''}</td>
      <td>
        <button class="ghost" type="button" onclick="editRecord('${safe}')">Edit</button>
        <button class="danger" type="button" onclick="deleteRecord('${safe}')">Delete</button>
      </td>
    </tr>`;
  }).join('') || '<tr><td colspan="6" class="muted">Tiada rekod dijumpai.</td></tr>';

  el('recordCount').textContent = `${names.length} rekod`;
}

function renderTeacherListView() {
  const names = [...state.teachers].sort();

  el('teacherListView').innerHTML = names.length
    ? names.map((name) => {
        const rec = state.letters[name] || { positions: [] };
        return `<div style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
          <div style="font-weight:700;">${escapeHtml(name)}</div>
          <div class="muted small">${escapeHtml(rec.tahunBuku || '-')} • ${escapeHtml(rec.sesiAkademik || '-')}</div>
          <div style="margin-top:6px;">
            ${(rec.positions || []).map((p) => `<span class="pill">${escapeHtml(p)}</span>`).join('') || '<span class="muted">Tiada jawatan disimpan</span>'}
          </div>
        </div>`;
      }).join('')
    : '<span class="muted">Belum ada nama guru yang disimpan.</span>';
}

function renderAll() {
  renderTeacherDropdowns();
  renderPositions([]);
  renderSelectedTeacherPositions();
  renderTable();
  renderTeacherListView();
  el('rujKami').value = GLOBAL_RUJ;
}

async function exportJSON() {
  const payload = {
    teachers: state.teachers,
    positions: state.positions,
    letters: state.letters,
    globalRuj: GLOBAL_RUJ,
    headerSettings,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'data-surat-lantikan-sjkt-kuala-lipis.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

async function importJSON(file) {
  const reader = new FileReader();

  reader.onload = async (event) => {
    try {
      const data = JSON.parse(event.target.result);

      const teachers = Array.isArray(data.teachers) ? data.teachers : [];
      const positions = Array.isArray(data.positions) ? data.positions : [];
      const letters = data.letters && typeof data.letters === 'object' ? data.letters : {};
      const importedHeader = data.headerSettings && typeof data.headerSettings === 'object' ? data.headerSettings : null;
      const importedRuj = data.globalRuj && String(data.globalRuj).trim()
        ? String(data.globalRuj).trim()
        : 'CBD3047.100.6/1/3( )';

      const deleteLetters = await supabaseClient.from('letters').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (deleteLetters.error) throw deleteLetters.error;

      const deleteTeachers = await supabaseClient.from('teachers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (deleteTeachers.error) throw deleteTeachers.error;

      const deletePositions = await supabaseClient.from('positions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (deletePositions.error) throw deletePositions.error;

      if (teachers.length) {
        const insertTeachers = await supabaseClient
          .from('teachers')
          .upsert(teachers.map((name) => ({ name })), { onConflict: 'name' });

        if (insertTeachers.error) throw insertTeachers.error;
      }

      if (positions.length) {
        const insertPositions = await supabaseClient
          .from('positions')
          .upsert(positions.map((name) => ({ name })), { onConflict: 'name' });

        if (insertPositions.error) throw insertPositions.error;
      }

      const letterRows = Object.values(letters).map((rec) => ({
        teacher_name: rec.teacher,
        tarikh_surat: rec.tarikhSurat || null,
        tahun_buku: rec.tahunBuku || '',
        sesi_akademik: rec.sesiAkademik || '',
        tajuk_surat: rec.tajukSurat || '',
        tarikh_mula: rec.tarikhMula || null,
        tarikh_hingga: rec.tarikhHingga || null,
        ruj_kami: rec.rujKami || importedRuj,
        positions: Array.isArray(rec.positions) ? rec.positions : [],
        updated_at: new Date().toISOString(),
      }));

      if (letterRows.length) {
        const insertLetters = await supabaseClient
          .from('letters')
          .upsert(letterRows, { onConflict: 'teacher_name' });

        if (insertLetters.error) throw insertLetters.error;
      }

      if (importedHeader) {
        headerSettings = {
          ...headerSettings,
          leftLogo: importedHeader.leftLogo || '',
          rightLogo: importedHeader.rightLogo || '',
          schoolEmail: importedHeader.schoolEmail || 'cbd3047@moe.edu.my',
          note: importedHeader.note || '',
          principalName: importedHeader.principalName || 'JEYAKANTAN PATHMANABAN',
        };
        await saveHeaderSettings(false);
      }

      GLOBAL_RUJ = importedRuj;
      await loadRemoteData();
      renderAll();
      clearForm();
      updateLogoPreviews();
      alert('Import berjaya.');
    } catch (error) {
      showError(error, 'Fail JSON tidak sah.');
    }
  };

  reader.readAsText(file, 'utf-8');
}

function editRecord(name) {
  showTab('tab1');
  fillFormFromRecord(name);
}
window.editRecord = editRecord;

async function deleteRecord(name) {
  if (!confirm(`Padam rekod ${name}?`)) return;

  try {
    const deleteLetter = await supabaseClient
      .from('letters')
      .delete()
      .eq('teacher_name', name);

    if (deleteLetter.error) throw deleteLetter.error;

    const deleteTeacher = await supabaseClient
      .from('teachers')
      .delete()
      .eq('name', name);

    if (deleteTeacher.error) throw deleteTeacher.error;

    delete state.letters[name];
    state.teachers = state.teachers.filter((teacher) => teacher !== name);
    renderAll();
    clearForm();
  } catch (error) {
    showError(error, 'Gagal memadam rekod.');
  }
}
window.deleteRecord = deleteRecord;

document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => showTab(btn.dataset.tab));
});

el('logoLeftInput').addEventListener('change', (event) => handleLogoUpload(event.target.files[0], 'leftLogo'));
el('logoRightInput').addEventListener('change', (event) => handleLogoUpload(event.target.files[0], 'rightLogo'));

el('saveLogoSettingsBtn').addEventListener('click', async () => {
  try {
    await saveHeaderSettings(true);
  } catch (error) {
    showError(error, 'Gagal menyimpan tetapan header.');
  }
});

el('clearLogoSettingsBtn').addEventListener('click', async () => {
  try {
    await clearHeaderSettings();
  } catch (error) {
    showError(error, 'Gagal reset tetapan header.');
  }
});

el('addTeacherBtn').addEventListener('click', async () => {
  try {
    const name = el('newTeacherName').value.trim();

    if (!name) {
      alert('Sila taip nama guru.');
      return;
    }

    await ensureTeacher(name);
    state.teachers = [...new Set([...state.teachers, name])].sort();
    renderAll();
    renderTeacherDropdowns(name);
    el('newTeacherName').value = '';
    alert('Nama guru berjaya ditambah.');
  } catch (error) {
    showError(error, 'Gagal menambah guru.');
  }
});

el('addPositionBtn').addEventListener('click', async () => {
  try {
    const lines = el('newPositionText').value
      .split(/\n+/)
      .map((value) => value.trim())
      .filter(Boolean);

    if (!lines.length) {
      alert('Sila masukkan sekurang-kurangnya satu jawatan.');
      return;
    }

    const previouslySelected = getSelectedPositions();
    await ensurePositions(lines);
    state.positions = [...new Set(state.positions)].sort();
    renderPositions([...new Set([...previouslySelected, ...lines])]);
    el('newPositionText').value = '';
    renderSelectedTeacherPositions();
  } catch (error) {
    showError(error, 'Gagal menambah jawatan.');
  }
});

el('selectAllPositionsBtn').addEventListener('click', selectAllPositions);
el('clearAllPositionsBtn').addEventListener('click', clearAllPositions);

el('teacherSelect').addEventListener('change', (event) => fillFormFromRecord(event.target.value));

el('saveAssignmentBtn').addEventListener('click', async () => {
  try {
    await saveCurrentRecord();
  } catch (error) {
    showError(error, 'Gagal menyimpan rekod guru.');
  }
});

el('resetFormBtn').addEventListener('click', () => clearForm());
el('searchTeacher').addEventListener('input', renderTable);
el('exportJsonBtn').addEventListener('click', exportJSON);

el('importJsonInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    importJSON(file);
  }
});

el('rujKami').addEventListener('input', () => {
  GLOBAL_RUJ = el('rujKami').value.trim() || 'CBD3047.100.6/1/3( )';
});

el('previewOneBtn').addEventListener('click', async () => {
  try {
    const name = el('printTeacherSelect').value;
    if (!name || !state.letters[name]) {
      alert('Sila pilih guru yang mempunyai rekod.');
      return;
    }
    await saveHeaderSettings(false);
    openPreview([state.letters[name]], false);
  } catch (error) {
    showError(error, 'Gagal membuka preview.');
  }
});

el('printOneBtn').addEventListener('click', async () => {
  try {
    const name = el('printTeacherSelect').value;
    if (!name || !state.letters[name]) {
      alert('Sila pilih guru yang mempunyai rekod.');
      return;
    }
    await saveHeaderSettings(false);
    openPreview([state.letters[name]], true);
  } catch (error) {
    showError(error, 'Gagal mencetak surat.');
  }
});

el('previewAllBtn').addEventListener('click', async () => {
  try {
    const records = [...state.teachers]
      .sort()
      .map((name) => state.letters[name])
      .filter(Boolean);

    await saveHeaderSettings(false);
    openPreview(records, false);
  } catch (error) {
    showError(error, 'Gagal preview semua surat.');
  }
});

el('printAllBtn').addEventListener('click', async () => {
  try {
    const records = [...state.teachers]
      .sort()
      .map((name) => state.letters[name])
      .filter(Boolean);

    await saveHeaderSettings(false);
    openPreview(records, true);
  } catch (error) {
    showError(error, 'Gagal mencetak semua surat.');
  }
});

initApp();
