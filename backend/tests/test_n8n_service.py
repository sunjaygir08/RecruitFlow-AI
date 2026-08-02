import pytest

def test_n8n_workflow_files_exist():
    """Verify n8n workflow JSON files are present."""
    import os
    workflows_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'n8n', 'workflows')
    assert os.path.isdir(workflows_dir), "n8n/workflows directory should exist"
    
    files = os.listdir(workflows_dir)
    json_files = [f for f in files if f.endswith('.json')]
    assert len(json_files) >= 1, "Should have at least one workflow JSON file"
