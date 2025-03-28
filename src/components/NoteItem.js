export class NoteItem extends HTMLElement {
    static get observedAttributes() {
      return ['id', 'title', 'body', 'date', 'archived'];
    }
  
    attributeChangedCallback() {
      this.render();
    }
  
    render() {
      const archived = this.getAttribute('archived') === 'true';
      const date = new Date(this.getAttribute('date'));
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}`;
  
      console.log('Rendering NoteItem:', {
        id: this.getAttribute('id'),
        title: this.getAttribute('title'),
        body: this.getAttribute('body'),
        date: formattedDate,
        archived,
      }); 
  
      this.innerHTML = `
        <div class="note-item">
          <h2>${this.getAttribute('title')}</h2>
          <p>${this.getAttribute('body')}</p>
          <small>${formattedDate}</small>
          <div class="actions">
            <button class="delete-btn">Hapus</button>
            <button class="archive-btn">${archived ? 'Buka Arsip' : 'Arsipkan'}</button>
          </div>
        </div>
      `;
  
      this.querySelector('.delete-btn').addEventListener('click', async () => {
        try {
          document.querySelector('loading-indicator').setAttribute('active', '');
          const response = await fetch(
            `https://notes-api.dicoding.dev/v2/notes/${this.getAttribute('id')}`,
            {
              method: 'DELETE',
            }
          );
  
          const result = await response.json();
          console.log('Response dari API (DELETE):', result); 
          if (result.status !== 'success') {
            throw new Error(result.message || 'Gagal menghapus catatan');
          }
  
          // Refresh daftar catatan setelah hapus
          await document.querySelector('note-list').fetchAndRender();
        } catch (error) {
          console.error('Error saat menghapus catatan:', error); 
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message || 'Gagal menghapus catatan!',
          });
        } finally {
          document.querySelector('loading-indicator').removeAttribute('active');
        }
      });
  
      this.querySelector('.archive-btn').addEventListener('click', async () => {
        try {
          document.querySelector('loading-indicator').setAttribute('active', '');
          const url = archived
            ? `https://notes-api.dicoding.dev/v2/notes/${this.getAttribute('id')}/unarchive`
            : `https://notes-api.dicoding.dev/v2/notes/${this.getAttribute('id')}/archive`;
          const response = await fetch(url, {
            method: 'POST',
          });
  
          const result = await response.json();
          console.log('Response dari API (ARCHIVE/UNARCHIVE):', result); 
          if (result.status !== 'success') {
            throw new Error(result.message || 'Gagal mengarsipkan catatan');
          }
  
          // Refresh daftar catatan setelah arsip
          await document.querySelector('note-list').fetchAndRender();
        } catch (error) {
          console.error('Error saat mengarsipkan catatan:', error); 
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message || 'Gagal mengarsipkan catatan!',
          });
        } finally {
          document.querySelector('loading-indicator').removeAttribute('active');
        }
      });
    }
  }
  
  customElements.define('note-item', NoteItem);