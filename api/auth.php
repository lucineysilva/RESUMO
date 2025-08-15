<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'database-sqlite.php';

class AuthAPI {
    private $db;

    public function __construct() {
        $this->db = new DatabaseSQLite();
    }

    public function login($email, $password) {
        try {
            $query = "SELECT id, email, password, name FROM users WHERE email = ?";
            $user = $this->db->fetchOne($query, [$email]);
            
            if ($user && password_verify($password, $user['password'])) {
                unset($user['password']);
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
            $user = $this->db->fetchOne($query, [$email]);
            
            if ($user) {
                return [
                    'success' => false,
                    'message' => 'Email já cadastrado'
                ];
            }

            // Criar novo usuário
            $password_hash = password_hash($password, PASSWORD_DEFAULT);
            
            $user_id = $this->db->insert('users', [
                'email' => $email,
                'password' => $password_hash,
                'name' => $name ?: $email
            ]);
            
            return [
                'success' => true,
                'user' => [
                    'id' => $user_id,
                    'email' => $email,
                    'name' => $name ?: $email
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
