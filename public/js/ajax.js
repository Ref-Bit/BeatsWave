/* ----------------------------------------------------------- */
/*  DELETE Genre
/* ----------------------------------------------------------- */
$(document).ready(function () {
    $('.delete-genre').on('click', function (event) {
        event.preventDefault();
        var id = $(this).data('id');
        var url = '/genres/delete/'+id;
        if (confirm('Delete Genre?')){
            $.ajax({
                url: url,
                type: 'POST',
                data: {id: id},
                success: function (result) {
                    console.log('Deleting Genre...');
                    window.location.reload();
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    });
});

/* ----------------------------------------------------------- */
/*  DELETE Album
/* ----------------------------------------------------------- */
$(document).ready(function () {
    $('.delete-album').on('click', function (event) {
        event.preventDefault();
        var id = $(this).data('id');
        var url = '/albums/delete/'+id;
        if (confirm('Delete Album?')){
            $.ajax({
                url: url,
                type: 'POST',
                data: {id: id},
                success: function (result) {
                    console.log('Deleting Album...');
                    window.location.href = '/albums';
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    });
});