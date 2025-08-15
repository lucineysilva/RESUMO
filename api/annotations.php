<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'database.php';

class AnnotationsAPI {
    private $db;
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // HIGHLIGHTS
    public function createHighlight($user_id, $file_path, $start_offset, $end_offset, $text) {
        try {
            $query = "INSERT INTO highlights (user_id, file_path, start_offset, end_offset, text) VALUES (?, ?, ?, ?, ?)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$user_id, $file_path, $start_offset, $end_offset, $text]);
            
            $id = $this->conn->lastInsertId();
            
            return [
                'success' => true,
                'highlight' => [
                    'id' => $id,
                    'user_id' => $user_id,
                    'file_path' => $file_path,
                    'start_offset' => $start_offset,
                    'end_offset' => $end_offset,
                    'text' => $text,
                    'created_at' => date('Y-m-d H:i:s')
                ]
            ];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function getHighlights($user_id, $file_path) {
        try {
            $query = "SELECT * FROM highlights WHERE user_id = ? AND file_path = ? ORDER BY created_at ASC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$user_id, $file_path]);
            
            $highlights = $stmt->fetchAll();
            
            return [
                'success' => true,
                'highlights' => $highlights
            ];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function deleteHighlight($user_id, $highlight_id) {
        try {
            $query = "DELETE FROM highlights WHERE id = ? AND user_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$highlight_id, $user_id]);
            
            return ['success' => true, 'message' => 'Highlight excluído'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    // NOTES
    public function createNote($user_id, $file_path, $start_offset, $end_offset, $text, $note_content) {
        try {
            $query = "INSERT INTO notes (user_id, file_path, start_offset, end_offset, text, note_content) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$user_id, $file_path, $start_offset, $end_offset, $text, $note_content]);
            
            $id = $this->conn->lastInsertId();
            
            return [
                'success' => true,
                'note' => [
                    'id' => $id,
                    'user_id' => $user_id,
                    'file_path' => $file_path,
                    'start_offset' => $start_offset,
                    'end_offset' => $end_offset,
                    'text' => $text,
                    'note_content' => $note_content,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ]
            ];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function getNotes($user_id, $file_path) {
        try {
            $query = "SELECT * FROM notes WHERE user_id = ? AND file_path = ? ORDER BY created_at ASC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$user_id, $file_path]);
            
            $notes = $stmt->fetchAll();
            
            return [
                'success' => true,
                'notes' => $notes
            ];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function updateNote($user_id, $note_id, $note_content) {
        try {
            $query = "UPDATE notes SET note_content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$note_content, $note_id, $user_id]);
            
            return ['success' => true, 'message' => 'Nota atualizada'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function deleteNote($user_id, $note_id) {
        try {
            $query = "DELETE FROM notes WHERE id = ? AND user_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$note_id, $user_id]);
            
            return ['success' => true, 'message' => 'Nota excluída'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}

// Processar requisição
$annotations = new AnnotationsAPI();
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Simples sistema de autenticação por header
$user_id = $_SERVER['HTTP_X_USER_ID'] ?? null;

if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'Usuário não autenticado']);
    exit;
}

switch ($method) {
    case 'GET':
        $type = $_GET['type'] ?? '';
        $file_path = $_GET['file_path'] ?? '';
        
        if ($type === 'highlights') {
            $result = $annotations->getHighlights($user_id, $file_path);
        } elseif ($type === 'notes') {
            $result = $annotations->getNotes($user_id, $file_path);
        } else {
            $result = ['success' => false, 'message' => 'Tipo inválido'];
        }
        
        echo json_encode($result);
        break;
        
    case 'POST':
        $type = $input['type'] ?? '';
        
        if ($type === 'highlight') {
            $result = $annotations->createHighlight(
                $user_id,
                $input['file_path'],
                $input['start_offset'],
                $input['end_offset'],
                $input['text']
            );
        } elseif ($type === 'note') {
            $result = $annotations->createNote(
                $user_id,
                $input['file_path'],
                $input['start_offset'],
                $input['end_offset'],
                $input['text'],
                $input['note_content']
            );
        } else {
            $result = ['success' => false, 'message' => 'Tipo inválido'];
        }
        
        echo json_encode($result);
        break;
        
    case 'PUT':
        if (isset($input['note_content'])) {
            $result = $annotations->updateNote($user_id, $input['id'], $input['note_content']);
        } else {
            $result = ['success' => false, 'message' => 'Dados inválidos'];
        }
        
        echo json_encode($result);
        break;
        
    case 'DELETE':
        $id = $_GET['id'] ?? '';
        $type = $_GET['type'] ?? '';
        
        if ($type === 'highlight') {
            $result = $annotations->deleteHighlight($user_id, $id);
        } elseif ($type === 'note') {
            $result = $annotations->deleteNote($user_id, $id);
        } else {
            $result = ['success' => false, 'message' => 'Tipo inválido'];
        }
        
        echo json_encode($result);
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Método não permitido']);
}
?>
