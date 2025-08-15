<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-User-ID');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'database-sqlite.php';

class AnnotationAPI {
    private $db;

    public function __construct() {
        $this->db = new DatabaseSQLite();
    }

    private function getUserId() {
        $headers = getallheaders();
        $userId = $headers['X-User-ID'] ?? null;
        
        if (!$userId) {
            throw new Exception('User ID não fornecido');
        }
        
        return intval($userId);
    }

    public function createHighlight($data) {
        try {
            $userId = $this->getUserId();
            
            $highlightData = [
                'user_id' => $userId,
                'file_path' => $data['file_path'],
                'start_offset' => intval($data['start_offset']),
                'end_offset' => intval($data['end_offset']),
                'text' => $data['text']
            ];
            
            $id = $this->db->insert('highlights', $highlightData);
            
            // Buscar o highlight criado
            $highlight = $this->db->fetchOne(
                "SELECT * FROM highlights WHERE id = ?",
                [$id]
            );
            
            return [
                'success' => true,
                'highlight' => $highlight,
                'message' => 'Highlight criado com sucesso'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao criar highlight: ' . $e->getMessage()
            ];
        }
    }

    public function getHighlights($filePath) {
        try {
            $userId = $this->getUserId();
            
            $highlights = $this->db->fetchAll(
                "SELECT * FROM highlights WHERE file_path = ? AND user_id = ? ORDER BY start_offset ASC",
                [$filePath, $userId]
            );
            
            return [
                'success' => true,
                'highlights' => $highlights
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao buscar highlights: ' . $e->getMessage()
            ];
        }
    }

    public function deleteHighlight($id) {
        try {
            $userId = $this->getUserId();
            
            // Verificar se o highlight pertence ao usuário
            $highlight = $this->db->fetchOne(
                "SELECT * FROM highlights WHERE id = ? AND user_id = ?",
                [$id, $userId]
            );
            
            if (!$highlight) {
                return [
                    'success' => false,
                    'message' => 'Highlight não encontrado ou não pertence ao usuário'
                ];
            }
            
            $this->db->delete('highlights', 'id = ?', [$id]);
            
            return [
                'success' => true,
                'message' => 'Highlight removido com sucesso'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao remover highlight: ' . $e->getMessage()
            ];
        }
    }

    public function createNote($data) {
        try {
            $userId = $this->getUserId();
            
            $noteData = [
                'user_id' => $userId,
                'file_path' => $data['file_path'],
                'start_offset' => intval($data['start_offset']),
                'end_offset' => intval($data['end_offset']),
                'text' => $data['text'],
                'note_content' => $data['note_content']
            ];
            
            $id = $this->db->insert('notes', $noteData);
            
            // Buscar a nota criada
            $note = $this->db->fetchOne(
                "SELECT * FROM notes WHERE id = ?",
                [$id]
            );
            
            return [
                'success' => true,
                'note' => $note,
                'message' => 'Nota criada com sucesso'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao criar nota: ' . $e->getMessage()
            ];
        }
    }

    public function getNotes($filePath) {
        try {
            $userId = $this->getUserId();
            
            $notes = $this->db->fetchAll(
                "SELECT * FROM notes WHERE file_path = ? AND user_id = ? ORDER BY start_offset ASC",
                [$filePath, $userId]
            );
            
            return [
                'success' => true,
                'notes' => $notes
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao buscar notas: ' . $e->getMessage()
            ];
        }
    }

    public function updateNote($id, $noteContent) {
        try {
            $userId = $this->getUserId();
            
            // Verificar se a nota pertence ao usuário
            $note = $this->db->fetchOne(
                "SELECT * FROM notes WHERE id = ? AND user_id = ?",
                [$id, $userId]
            );
            
            if (!$note) {
                return [
                    'success' => false,
                    'message' => 'Nota não encontrada ou não pertence ao usuário'
                ];
            }
            
            $this->db->update(
                'notes',
                ['note_content' => $noteContent, 'updated_at' => date('Y-m-d H:i:s')],
                'id = ?',
                [$id]
            );
            
            return [
                'success' => true,
                'message' => 'Nota atualizada com sucesso'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao atualizar nota: ' . $e->getMessage()
            ];
        }
    }

    public function deleteNote($id) {
        try {
            $userId = $this->getUserId();
            
            // Verificar se a nota pertence ao usuário
            $note = $this->db->fetchOne(
                "SELECT * FROM notes WHERE id = ? AND user_id = ?",
                [$id, $userId]
            );
            
            if (!$note) {
                return [
                    'success' => false,
                'message' => 'Nota não encontrada ou não pertence ao usuário'
                ];
            }
            
            $this->db->delete('notes', 'id = ?', [$id]);
            
            return [
                'success' => true,
                'message' => 'Nota removida com sucesso'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Erro ao remover nota: ' . $e->getMessage()
            ];
        }
    }
}

// Processar requisições
try {
    $api = new AnnotationAPI();
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                throw new Exception('Dados de entrada inválidos');
            }
            
            if ($input['type'] === 'highlight') {
                $result = $api->createHighlight($input);
            } elseif ($input['type'] === 'note') {
                $result = $api->createNote($input);
            } else {
                throw new Exception('Tipo de operação inválido');
            }
            break;
            
        case 'GET':
            $type = $_GET['type'] ?? '';
            $filePath = $_GET['file_path'] ?? '';
            
            if (empty($filePath)) {
                throw new Exception('Caminho do arquivo não fornecido');
            }
            
            if ($type === 'highlights') {
                $result = $api->getHighlights($filePath);
            } elseif ($type === 'notes') {
                $result = $api->getNotes($filePath);
            } else {
                throw new Exception('Tipo de consulta inválido');
            }
            break;
            
        case 'PUT':
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input || !isset($input['id']) || !isset($input['note_content'])) {
                throw new Exception('Dados de entrada inválidos');
            }
            
            $result = $api->updateNote($input['id'], $input['note_content']);
            break;
            
        case 'DELETE':
            $type = $_GET['type'] ?? '';
            $id = $_GET['id'] ?? '';
            
            if (empty($id)) {
                throw new Exception('ID não fornecido');
            }
            
            if ($type === 'highlight') {
                $result = $api->deleteHighlight($id);
            } elseif ($type === 'note') {
                $result = $api->deleteNote($id);
            } else {
                throw new Exception('Tipo de remoção inválido');
            }
            break;
            
        default:
            throw new Exception('Método não permitido');
    }
    
    echo json_encode($result);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
