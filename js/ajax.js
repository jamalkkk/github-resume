$(function () {


    /**
     *  Hnadles user input
     *
     */

    $("#searchBtn").click(function () {

        $.ajax({
            var text = $(this).val();
            var filter = $('.filters-box').attr('name');

            $.ajax({
                type: "GET",
                url: "search",
                data: {
                    input: text,
                    type: filter
                },
                dataType: "json",
                success: formCompleted,
                error: formFailed
            });

        });
    });
});
