<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'database.php';

class AuthAPI {
    private $db;
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function login($email, $password) {
        try {
            $query = "SELECT id, email, password_hash, name FROM users WHERE email = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$email]);
            
            $user = $stmt->fetch();
            
            if ($user && password_verify($password, $user['password_hash'])) {
                unset($user['password_hash']);
                return [
                    'success' => true,
                    'user' => $user,
                    'message' => 'Login realizado com sucesso'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Email ou senha incorretos'
                ];
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro interno: ' . $e->getMessage()
            ];
        }
    }

    public function register($email, $password, $name = null) {
        try {
            // Verificar se usuário já existe
            $query = "SELECT id FROM users WHERE email = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$email]);
            
            if ($stmt->fetch()) {
                return [
                    'success' => false,
                    'message' => 'Email já cadastrado'
                ];
            }

            // Criar novo usuário
            $password_hash = password_hash($password, PASSWORD_DEFAULT);
            $query = "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$email, $password_hash, $name]);
            
            $user_id = $this->conn->lastInsertId();
            
            return [
                'success' => true,
                'user' => [
                    'id' => $user_id,
                    'email' => $email,
                    'name' => $name
                ],
                'message' => 'Usuário criado com sucesso'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro interno: ' . $e->getMessage()
            ];
        }
    }
}

// Processar requisição
$auth = new AuthAPI();
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    $action = $_GET['action'] ?? '';
    
    switch ($action) {
        case 'login':
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
            
            if (empty($email) || empty($password)) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Email e senha são obrigatórios'
                ]);
                exit;
            }
            
            $result = $auth->login($email, $password);
            echo json_encode($result);
            break;
            
        case 'register':
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
            $name = $input['name'] ?? null;
            
            if (empty($email) || empty($password)) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Email e senha são obrigatórios'
                ]);
                exit;
            }
            
            $result = $auth->register($email, $password, $name);
            echo json_encode($result);
            break;
            
        default:
            echo json_encode([
                'success' => false,
                'message' => 'Ação não encontrada'
            ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método não permitido'
    ]);
}
?>
