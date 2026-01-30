$('#scrapeBtn').click(function () {
    $('#progressModal').modal('show');
    $('#statusText').text('Task started...');

    $.post('/start-scraping/', { email: 'durgaprasadp552@gmail.com' }, function (data) {
        const taskID = data.task_id;

        const interval = setInterval(() => {
            $.get(`/scraping-status/${taskID}/`, function (res) {
                if (res.status === 'completed') {
                    $('#statusText').text(`✅ Done! Added: ${res.result.added}, Skipped: ${res.result.skipped}`);
                    clearInterval(interval);
                } else if (res.status === 'failed') {
                    $('#statusText').text('❌ Task failed. Check your email.');
                    clearInterval(interval);
                } else {
                    $('#statusText').text('🔄 Scraping in progress...');
                }
            });
        }, 5000);
    });
});