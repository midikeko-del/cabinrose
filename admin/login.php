<?php
// login.php - Halaman Log Masuk Admin menggunakan PHP Session & MySQL

session_start();
require_once '../config.php';

// Jika sudah log masuk, terus bawa ke dashboard
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: index.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (empty($username) || empty($password)) {
        $error = 'Sila masukkan username dan password.';
    } else {
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
                $stmt->execute([$username]);
                $user = $stmt->fetch();

                if ($user && password_verify($password, $user['password'])) {
                    // Log masuk berjaya
                    $_SESSION['admin_logged_in'] = true;
                    $_SESSION['admin_username'] = $user['username'];
                    header('Location: index.php');
                    exit;
                } else {
                    $error = 'Username atau password salah.';
                }
            } catch (Exception $e) {
                $error = 'Ralat pangkalan data: ' . $e->getMessage();
            }
        } else {
            $error = 'Pangkalan data tidak disambungkan. Sila periksa config.php dan pastikan MySQL diaktifkan di XAMPP.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Admin | Cabin Rose Station</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
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
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }
    .card {
      width: 100%;
      max-width: 400px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 2.5rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    }
    h1 {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      text-align: center;
    }
    .subtitle {
      font-size: 0.9rem;
      color: var(--muted);
      text-align: center;
      margin-bottom: 2rem;
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    label {
      display: block;
      font-size: 0.88rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    input {
      width: 100%;
      padding: 0.8rem 1rem;
      border: 1px solid var(--line);
      background-color: var(--bg);
      color: var(--ink);
      border-radius: var(--radius);
      font-family: inherit;
      font-size: 0.95rem;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    input:focus {
      outline: none;
      border-color: var(--accent);
    }
    .error-msg {
      background: color-mix(in srgb, var(--accent) 10%, transparent);
      border: 1px solid var(--accent);
      color: var(--accent);
      padding: 0.8rem;
      border-radius: var(--radius);
      font-size: 0.88rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    .btn {
      width: 100%;
      background: var(--ink);
      color: var(--bg);
      border: none;
      padding: 0.9rem;
      border-radius: 999px;
      font-family: inherit;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
      transition: opacity 0.2s, transform 0.1s;
    }
    .btn:hover {
      opacity: 0.9;
    }
    .btn:active {
      transform: scale(0.98);
    }
    .back-link {
      display: block;
      text-align: center;
      font-size: 0.88rem;
      color: var(--muted);
      text-decoration: none;
      margin-top: 1.5rem;
    }
    .back-link:hover {
      color: var(--accent);
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Log Masuk Admin</h1>
    <p class="subtitle">Cabin Rose Station Management</p>

    <?php if ($error): ?>
      <div class="error-msg"><?php echo htmlspecialchars($error); ?></div>
    <?php endif; ?>

    <form method="POST" action="">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" required autocomplete="username">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required autocomplete="current-password">
      </div>
      <button type="submit" class="btn">Log Masuk</button>
    </form>

    <a href="../" class="back-link">&larr; Kembali ke Laman Utama</a>
  </div>
</body>
</html>
