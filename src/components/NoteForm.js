export class NoteForm extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <form id="noteForm">
          <input type="text" id="title" placeholder="Judul Catatan" required>
          <textarea id="body" rows="4" placeholder="Isi Catatan" required></textarea>
          <button type="submit">Tambah Catatan</button>
        </form>
      `;
  
      this.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = this.querySelector('#title').value;
        const body = this.querySelector('#body').value;
  
        try {
          console.log('Menambahkan catatan baru:', { title, body }); 
          document.querySelector('loading-indicator').setAttribute('active', '');
  
          // Kirim request untuk menambah catatan baru
          const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, body }),
          });
  
          const result = await response.json();
          console.log('Response dari API (POST):', result); 
  
          if (result.status !== 'success') {
            throw new Error(result.message || 'Gagal menambahkan catatan');
          }
  
          // Refresh daftar catatan setelah berhasil menambah
          const noteList = document.querySelector('note-list');
          console.log('Memperbarui daftar catatan...');
          await noteList.fetchAndRender();
  
          // Reset form setelah berhasil
          e.target.reset();
        } catch (error) {
          console.error('Error saat menambahkan catatan:', error); 
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message || 'Gagal menambahkan catatan!',
          });
        } finally {
          // Sembunyikan indikator loading
          document.querySelector('loading-indicator').removeAttribute('active');
        }
      });
  
      // Realtime validation
      this.querySelector('#title').addEventListener('input', (e) => {
        if (e.target.value.length < 3) {
          e.target.style.borderColor = 'red';
        } else {
          e.target.style.borderColor = '#ddd';
        }
      });
    }
  }
  
  customElements.define('note-form', NoteForm);