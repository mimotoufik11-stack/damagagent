class StorageService {
  constructor() {
    this.storageKey = 'quran-video-editor-projects';
  }

  async saveProject(project) {
    try {
      const projects = await this.getAllProjects();
      const existingIndex = projects.findIndex(p => p.id === project.id);
      
      if (existingIndex >= 0) {
        projects[existingIndex] = project;
      } else {
        projects.push(project);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(projects));
      return true;
    } catch (error) {
      console.error('Failed to save project:', error);
      throw error;
    }
  }

  async getAllProjects() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get projects:', error);
      return [];
    }
  }

  async getProject(projectId) {
    try {
      const projects = await this.getAllProjects();
      return projects.find(p => p.id === projectId);
    } catch (error) {
      console.error('Failed to get project:', error);
      return null;
    }
  }

  async deleteProject(projectId) {
    try {
      const projects = await this.getAllProjects();
      const filtered = projects.filter(p => p.id !== projectId);
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  }

  async exportProjectSettings(project, filePath) {
    try {
      const data = JSON.stringify(project, null, 2);
      await window.electronAPI.writeFile(filePath, data);
      return true;
    } catch (error) {
      console.error('Failed to export project:', error);
      throw error;
    }
  }

  async importProjectSettings(filePath) {
    try {
      const result = await window.electronAPI.readFile(filePath, 'utf8');
      if (result.success) {
        const project = JSON.parse(result.data);
        await this.saveProject(project);
        return project;
      }
      throw new Error(result.error);
    } catch (error) {
      console.error('Failed to import project:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();
