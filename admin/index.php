<?php
// index.php - Dashboard Admin untuk Cabin Rose Station (PHP + MySQL)

session_start();
require_once '../config.php';

// Sahkan sesi log masuk admin
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

$success = '';
$error = '';

if (!$pdo) {
    $error = 'Pangkalan data tidak disambungkan. Sila periksa fail config.php atau hidupkan MySQL di XAMPP.';
}

// Kunci tetapan yang dibenarkan
$allowed_keys = [
    'whatsapp', 'phone_display',
    'hours_daily_ms', 'hours_daily_en',
    'hours_fri_ms', 'hours_fri_en',
    'hours_weekday_ms', 'hours_weekday_en',
    'hours_friday_ms', 'hours_friday_en',
    'menu_i1_name_ms', 'menu_i1_name_en', 'menu_i1_desc_ms', 'menu_i1_desc_en',
    'menu_i2_name_ms', 'menu_i2_name_en', 'menu_i2_desc_ms', 'menu_i2_desc_en',
    'menu_i3_name_ms', 'menu_i3_name_en', 'menu_i3_desc_ms', 'menu_i3_desc_en',
    'menu_i4_name_ms', 'menu_i4_name_en', 'menu_i4_desc_ms', 'menu_i4_desc_en'
];

// Proses penyimpanan borang
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $pdo) {
    try {
        $pdo->beginTransaction();
        $stmt = $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) 
                               ON DUPLICATE KEY UPDATE setting_value = ?");
        
        foreach ($allowed_keys as $key) {
            if (isset($_POST[$key])) {
                $val = trim($_POST[$key]);
                $stmt->execute([$key, $val, $val]);
            }
        }
        $pdo->commit();
        $success = 'Tetapan kafe telah berjaya dikemas kini!';
    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        $error = 'Gagal menyimpan tetapan: ' . $e->getMessage();
    }
}

// Ambil tetapan semasa daripada pangkalan data
$settings = [];
if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT setting_key, setting_value FROM settings");
        while ($row = $stmt->fetch()) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
    } catch (Exception $e) {
        $error = 'Gagal memuatkan tetapan: ' . $e->getMessage();
    }
}

// Pastikan tiada ralat undefined index
foreach ($allowed_keys as $key) {
    if (!isset($settings[$key])) {
        $settings[$key] = '';
    }
}
?>
<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Admin | Cabin Rose Station</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/@phosphor-icons/web@2.1.1"></script>
  <style>
    :root {
      --bg: #f7f7f6;
      --surface: #ffffff;
      --ink: #141414;
      --muted: #6c6c6c;
      --line: #e4e4e2;
      --accent: #c84b61;
      --radius: 10px;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #111111;
        --surface: #1a1a1a;
        --ink: #f1f1f0;
        --muted: #9d9d9c;
        --line: #2b2b2b;
        --accent: #e66a81;
      }
    }
    body {
      margin: 0;
      font-family: "Outfit", sans-serif;
      background-color: var(--bg);
      color: var(--ink);
      padding-bottom: 50px;
    }
    header {
      background: var(--surface);
      border-bottom: 1px solid var(--line);
      padding: 1rem 20px;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .header-in {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-weight: 700;
      font-size: 1.2rem;
      color: var(--ink);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .logo span {
      color: var(--accent);
    }
    .user-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .user-info {
      font-size: 0.9rem;
      color: var(--muted);
    }
    .btn-logout {
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--accent);
      text-decoration: none;
      border: 1px solid var(--accent);
      padding: 0.4rem 1rem;
      border-radius: 999px;
      transition: all 0.2s;
    }
    .btn-logout:hover {
      background: var(--accent);
      color: #fff;
    }
    main {
      max-width: 1000px;
      margin: 2rem auto;
      padding: 0 20px;
    }
    h1 {
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
    }
    .alert {
      padding: 1rem;
      border-radius: var(--radius);
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
    }
    .alert-success {
      background: rgba(46, 117, 89, 0.1);
      border: 1px solid #2e7559;
      color: #2e7559;
    }
    .alert-error {
      background: color-mix(in srgb, var(--accent) 10%, transparent);
      border: 1px solid var(--accent);
      color: var(--accent);
    }
    
    /* Tab System */
    .tabs {
      display: flex;
      border-bottom: 1px solid var(--line);
      margin-bottom: 2rem;
      gap: 1rem;
      overflow-x: auto;
    }
    .tab-btn {
      padding: 0.75rem 1rem;
      background: transparent;
      border: none;
      color: var(--muted);
      font-family: inherit;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .tab-btn:hover {
      color: var(--ink);
    }
    .tab-btn.active {
      color: var(--accent);
      border-bottom-color: var(--accent);
    }
    .tab-content {
      display: none;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 2rem;
      box-shadow: 0 5px 15px rgba(0,0,0,0.02);
    }
    .tab-content.active {
      display: block;
    }

    .form-section-title {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--line);
      padding-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .form-section-title i {
      color: var(--accent);
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 768px) {
      .grid-2 {
        grid-template-columns: 1fr;
      }
    }

    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    .label-desc {
      font-size: 0.8rem;
      color: var(--muted);
      font-weight: 400;
      margin-top: -0.3rem;
      margin-bottom: 0.5rem;
    }
    input[type="text"], textarea {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid var(--line);
      background: var(--bg);
      color: var(--ink);
      border-radius: 6px;
      font-family: inherit;
      font-size: 0.95rem;
      box-sizing: border-box;
    }
    input[type="text"]:focus, textarea:focus {
      outline: none;
      border-color: var(--accent);
    }
    textarea {
      resize: vertical;
      height: 80px;
    }

    /* Bento Cards Settings grid */
    .menu-card-setup {
      background: var(--bg);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .menu-card-title {
      font-weight: 700;
      font-size: 1rem;
      margin-bottom: 1rem;
      color: var(--accent);
      display: flex;
      justify-content: space-between;
    }

    .submit-bar {
      margin-top: 2rem;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
    .btn-submit {
      background: var(--ink);
      color: var(--bg);
      border: none;
      padding: 0.85rem 2rem;
      font-family: inherit;
      font-weight: 600;
      font-size: 0.98rem;
      border-radius: 999px;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn-submit:hover {
      opacity: 0.9;
    }
    .btn-view-site {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      background: transparent;
      border: 1px solid var(--line);
      color: var(--ink);
      padding: 0.85rem 1.5rem;
      font-weight: 600;
      font-size: 0.98rem;
      border-radius: 999px;
      transition: all 0.2s;
    }
    .btn-view-site:hover {
      border-color: var(--ink);
      background: rgba(0,0,0,0.02);
    }
  </style>
</head>
<body>

  <header>
    <div class="header-in">
      <a href="../" class="logo" target="_blank"><i class="ph ph-storefront"></i>Cabin <span>Rose</span> Station</a>
      <div class="user-actions">
        <span class="user-info"><i class="ph ph-user-circle"></i> Log masuk: <strong><?php echo htmlspecialchars($_SESSION['admin_username']); ?></strong></span>
        <a href="logout.php" class="btn-logout"><i class="ph ph-sign-out"></i> Log Keluar</a>
      </div>
    </div>
  </header>

  <main>
    <h1>Dashboard Pengurusan Kafe</h1>

    <?php if ($success): ?>
      <div class="alert alert-success"><i class="ph ph-check-circle"></i> <?php echo htmlspecialchars($success); ?></div>
    <?php endif; ?>

    <?php if ($error): ?>
      <div class="alert alert-error"><i class="ph ph-warning-circle"></i> <?php echo htmlspecialchars($error); ?></div>
    <?php endif; ?>

    <form method="POST" action="">
      
      <!-- Nav Tabs -->
      <div class="tabs">
        <button type="button" class="tab-btn active" onclick="switchTab(event, 'tab-info')"><i class="ph ph-phone"></i> Hubungan & Am</button>
        <button type="button" class="tab-btn" onclick="switchTab(event, 'tab-hours')"><i class="ph ph-clock"></i> Waktu Operasi</button>
        <button type="button" class="tab-btn" onclick="switchTab(event, 'tab-menu')"><i class="ph ph-fork-knife"></i> Pengurusan Menu</button>
      </div>

      <!-- TAB 1: HUBUNGAN & AM -->
      <div id="tab-info" class="tab-content active">
        <h2 class="form-section-title"><i class="ph ph-phone-call"></i> Maklumat Hubungan</h2>
        
        <div class="grid-2">
          <div class="form-group">
            <label for="whatsapp">Nombor Telefon WhatsApp (Tanpa simbol +)</label>
            <p class="label-desc">Untuk pautan tempahan meja. Contoh: 60139642739</p>
            <input type="text" id="whatsapp" name="whatsapp" value="<?php echo htmlspecialchars($settings['whatsapp']); ?>" placeholder="60139642739" required>
          </div>
          
          <div class="form-group">
            <label for="phone_display">Nombor Telefon Paparan</label>
            <p class="label-desc">Nombor hubungan yang dipaparkan di web. Contoh: 013-964 2739</p>
            <input type="text" id="phone_display" name="phone_display" value="<?php echo htmlspecialchars($settings['phone_display']); ?>" placeholder="013-964 2739" required>
          </div>
        </div>
      </div>

      <!-- TAB 2: WAKTU OPERASI -->
      <div id="tab-hours" class="tab-content">
        <h2 class="form-section-title"><i class="ph ph-calendar"></i> Bar Info Operasi (Atas & Tengah)</h2>
        <div class="grid-2">
          <div class="form-group">
            <label for="hours_daily_ms">Waktu Buka Harian (Bahasa Melayu)</label>
            <input type="text" id="hours_daily_ms" name="hours_daily_ms" value="<?php echo htmlspecialchars($settings['hours_daily_ms']); ?>" placeholder="11:00 pagi - 11:00 malam" required>
          </div>
          <div class="form-group">
            <label for="hours_daily_en">Waktu Buka Harian (English)</label>
            <input type="text" id="hours_daily_en" name="hours_daily_en" value="<?php echo htmlspecialchars($settings['hours_daily_en']); ?>" placeholder="11:00 AM - 11:00 PM" required>
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label for="hours_fri_ms">Waktu Hari Jumaat (Bahasa Melayu)</label>
            <input type="text" id="hours_fri_ms" name="hours_fri_ms" value="<?php echo htmlspecialchars($settings['hours_fri_ms']); ?>" placeholder="3:00 petang - 11:00 malam" required>
          </div>
          <div class="form-group">
            <label for="hours_fri_en">Waktu Hari Jumaat (English)</label>
            <input type="text" id="hours_fri_en" name="hours_fri_en" value="<?php echo htmlspecialchars($settings['hours_fri_en']); ?>" placeholder="3:00 PM - 11:00 PM" required>
          </div>
        </div>

        <h2 class="form-section-title" style="margin-top: 2rem;"><i class="ph ph-map-pin"></i> Waktu Operasi Pada Kad Lokasi (Bawah)</h2>
        <div class="grid-2">
          <div class="form-group">
            <label for="hours_weekday_ms">Sabtu - Khamis (Bahasa Melayu)</label>
            <input type="text" id="hours_weekday_ms" name="hours_weekday_ms" value="<?php echo htmlspecialchars($settings['hours_weekday_ms']); ?>" required>
          </div>
          <div class="form-group">
            <label for="hours_weekday_en">Saturday - Thursday (English)</label>
            <input type="text" id="hours_weekday_en" name="hours_weekday_en" value="<?php echo htmlspecialchars($settings['hours_weekday_en']); ?>" required>
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label for="hours_friday_ms">Jumaat (Bahasa Melayu)</label>
            <input type="text" id="hours_friday_ms" name="hours_friday_ms" value="<?php echo htmlspecialchars($settings['hours_friday_ms']); ?>" required>
          </div>
          <div class="form-group">
            <label for="hours_friday_en">Friday (English)</label>
            <input type="text" id="hours_friday_en" name="hours_friday_en" value="<?php echo htmlspecialchars($settings['hours_friday_en']); ?>" required>
          </div>
        </div>
      </div>

      <!-- TAB 3: PENGURUSAN MENU BENTO -->
      <div id="tab-menu" class="tab-content">
        <h2 class="form-section-title"><i class="ph ph-pizza"></i> Pengurusan Menu Utama (Bento Grid)</h2>
        
        <!-- Slot 1 -->
        <div class="menu-card-setup">
          <div class="menu-card-title">Slot 1: Corndog Signature <span>(Kad Utama / Feature)</span></div>
          <div class="grid-2">
            <div class="form-group">
              <label>Nama Menu (BM)</label>
              <input type="text" name="menu_i1_name_ms" value="<?php echo htmlspecialchars($settings['menu_i1_name_ms']); ?>" required>
            </div>
            <div class="form-group">
              <label>Menu Name (EN)</label>
              <input type="text" name="menu_i1_name_en" value="<?php echo htmlspecialchars($settings['menu_i1_name_en']); ?>" required>
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label>Deskripsi (BM)</label>
              <textarea name="menu_i1_desc_ms" required><?php echo htmlspecialchars($settings['menu_i1_desc_ms']); ?></textarea>
            </div>
            <div class="form-group">
              <label>Description (EN)</label>
              <textarea name="menu_i1_desc_en" required><?php echo htmlspecialchars($settings['menu_i1_desc_en']); ?></textarea>
            </div>
          </div>
        </div>

        <!-- Slot 2 -->
        <div class="menu-card-setup">
          <div class="menu-card-title">Slot 2: Nasi Buttermilk</div>
          <div class="grid-2">
            <div class="form-group">
              <label>Nama Menu (BM)</label>
              <input type="text" name="menu_i2_name_ms" value="<?php echo htmlspecialchars($settings['menu_i2_name_ms']); ?>" required>
            </div>
            <div class="form-group">
              <label>Menu Name (EN)</label>
              <input type="text" name="menu_i2_name_en" value="<?php echo htmlspecialchars($settings['menu_i2_name_en']); ?>" required>
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label>Deskripsi (BM)</label>
              <textarea name="menu_i2_desc_ms" required><?php echo htmlspecialchars($settings['menu_i2_desc_ms']); ?></textarea>
            </div>
            <div class="form-group">
              <label>Description (EN)</label>
              <textarea name="menu_i2_desc_en" required><?php echo htmlspecialchars($settings['menu_i2_desc_en']); ?></textarea>
            </div>
          </div>
        </div>

        <!-- Slot 3 -->
        <div class="menu-card-setup">
          <div class="menu-card-title">Slot 3: Chicken Chop & Grill</div>
          <div class="grid-2">
            <div class="form-group">
              <label>Nama Menu (BM)</label>
              <input type="text" name="menu_i3_name_ms" value="<?php echo htmlspecialchars($settings['menu_i3_name_ms']); ?>" required>
            </div>
            <div class="form-group">
              <label>Menu Name (EN)</label>
              <input type="text" name="menu_i3_name_en" value="<?php echo htmlspecialchars($settings['menu_i3_name_en']); ?>" required>
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label>Deskripsi (BM)</label>
              <textarea name="menu_i3_desc_ms" required><?php echo htmlspecialchars($settings['menu_i3_desc_ms']); ?></textarea>
            </div>
            <div class="form-group">
              <label>Description (EN)</label>
              <textarea name="menu_i3_desc_en" required><?php echo htmlspecialchars($settings['menu_i3_desc_en']); ?></textarea>
            </div>
          </div>
        </div>

        <!-- Slot 4 -->
        <div class="menu-card-setup">
          <div class="menu-card-title">Slot 4: Kopi & Dessert <span>(Kad Lebar / Wide)</span></div>
          <div class="grid-2">
            <div class="form-group">
              <label>Nama Menu (BM)</label>
              <input type="text" name="menu_i4_name_ms" value="<?php echo htmlspecialchars($settings['menu_i4_name_ms']); ?>" required>
            </div>
            <div class="form-group">
              <label>Menu Name (EN)</label>
              <input type="text" name="menu_i4_name_en" value="<?php echo htmlspecialchars($settings['menu_i4_name_en']); ?>" required>
            </div>
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label>Deskripsi (BM)</label>
              <textarea name="menu_i4_desc_ms" required><?php echo htmlspecialchars($settings['menu_i4_desc_ms']); ?></textarea>
            </div>
            <div class="form-group">
              <label>Description (EN)</label>
              <textarea name="menu_i4_desc_en" required><?php echo htmlspecialchars($settings['menu_i4_desc_en']); ?></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Bar -->
      <div class="submit-bar">
        <a href="../" target="_blank" class="btn-view-site"><i class="ph ph-arrow-square-out"></i> Lihat Web Utama</a>
        <button type="submit" class="btn-submit"><i class="ph ph-floppy-disk"></i> Simpan Semua Tetapan</button>
      </div>

    </form>
  </main>

  <script>
    // Tab switching logic
    function switchTab(evt, tabId) {
      // Hide all contents
      var contents = document.getElementsByClassName("tab-content");
      for (var i = 0; i < contents.length; i++) {
        contents[i].classList.remove("active");
      }

      // Remove active class from all buttons
      var buttons = document.getElementsByClassName("tab-btn");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
      }

      // Show specific content and mark button active
      document.getElementById(tabId).classList.add("active");
      evt.currentTarget.classList.add("active");
    }
  </script>
</body>
</html>
