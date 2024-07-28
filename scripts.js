document.getElementById('infoForm').addEventListener('submit', function(event) {
    // The default form submission behavior is handled by the server-side
});

function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const preview = document.getElementById('preview');
        preview.src = reader.result;
        document.getElementById('previewContainer').style.display = 'block';
    }
    reader.readAsDataURL(event.target.files[0]);
}

function removeImage() {
    document.getElementById('idPicture').value = "";
    document.getElementById('preview').src = "#";
    document.getElementById('previewContainer').style.display = 'none';
}
