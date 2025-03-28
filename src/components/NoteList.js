export class NoteList extends HTMLElement {
    async fetchAndRender() {
      try {
        console.log('Mengambil data dari API...');
        document.querySelector('loading-indicator').setAttribute('active', '');
  
        const response = await fetch('https://notes-api.dicoding.dev/v2/notes');
        const result = await response.json();
  
        console.log('Response dari API:', result); 
  
        if (result.status !== 'success') {
          throw new Error(result.message || 'Gagal mengambil data catatan');
        }
  
        this.innerHTML = '';
        console.log('Jumlah catatan yang diterima:', result.data.length); 
  
        const sortedNotes = result.data.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
        // Render setiap catatan
        sortedNotes.forEach((note, index) => {
          console.log(`Rendering catatan ${index + 1}:`, note); // Debugging: lihat setiap catatan yang dirender
          const noteItem = document.createElement('note-item');
          noteItem.setAttribute('id', note.id);
          noteItem.setAttribute('title', note.title);
          noteItem.setAttribute('body', note.body);
          noteItem.setAttribute('date', note.createdAt);
          noteItem.setAttribute('archived', note.archived);
          this.appendChild(noteItem);
        });
  
        // Jika tidak ada catatan, tampilkan pesan
        if (sortedNotes.length === 0) {
          console.log('Tidak ada catatan untuk ditampilkan.');
          this.innerHTML = '<p style="text-align: center;">Tidak ada catatan.</p>';
        }
      } catch (error) {
        console.error('Error saat mengambil data:', error); // Debugging: lihat error
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message || 'Gagal mengambil data catatan!',
        });
      } finally {
        // Sembunyikan indikator loading
        document.querySelector('loading-indicator').removeAttribute('active');
      }
    }
  
    connectedCallback() {
      console.log('NoteList connected, memanggil fetchAndRender...');
      this.fetchAndRender();
    }
  }
  
  customElements.define('note-list', NoteList);