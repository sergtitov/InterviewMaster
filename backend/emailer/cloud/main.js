Parse.Cloud.define("sendEmail", function(request, response) {
    var sendgrid = require("sendgrid");
    sendgrid.initialize("sergtitov", "G8GyHtWVQDyr8A");

    var name = request.params.name;
    var email = request.params.email;
    var subject = request.params.subject;
    var message = request.params.message;

    sendgrid.sendEmail({
        to: "sergtitov@gmail.com",
        from: email,
        fromname: name,
        subject: subject,
        text: message
    }, {
        success: function(httpResponse) {
            console.log(httpResponse);
            response.success("Email sent!");
        },
        error: function(httpResponse) {
            console.error(httpResponse);
            response.error("Oh, something went wrong.");
        }
    });
});
