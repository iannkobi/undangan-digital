function BukaUndangan () {
    
    const coverSection = document.getElementById('cover-section');

    const mainContent = document.getElementById ('main-content');

    coverSection.classList.add('hidden');

    mainContent.classList.remove('hidden');

    window.scrollTo({
        top:0,
        behavior:'smooth'
    });
}

function tutupUndangan () {
    const coverSection = document.getElementById('cover-section');
    const mainContent = document.getElementById('main-content');

    coverSection.classList.remove('hidden');
    mainContent.classList.add('hidden');
    const tombolBuka = document.querySelector('#cover-selection button');
    tombolBuka.textContent = "Lihat Undangan Kembali"; 
    //geser layar kembali ke paling atas

    window.scrollTo({
        top:0,
        behavior:'smooth'
    });
}