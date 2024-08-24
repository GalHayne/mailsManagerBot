function deleteSpamEmails() {

    var spamThreads = GmailApp.getSpamThreads();
    var spamCount = spamThreads.length;


    // Log the number of spam emails
    Logger.log("Number of Spam threads: " + spamCount);

    if (spamCount > 0) {
        try {
            // Attempt to delete the spam emails
            for (var i = 0; i < spamCount; i++) {
                GmailApp.moveThreadToTrash(spamThreads[i]);
            }
            // If successful, send a message to your Telegram bot
            var payload = {
                "chat_id": chatId,
                "text": message
            };

            var options = {
                "method": "post",
                "payload": payload
            };

            var message = "Number of Spam threads: " + spamCount + "\n" + "Successfully deleted " + spamCount + " threads from Spam."

            // sendMsgToTelegram(message)

            UrlFetchApp.fetch(url, options);

        } catch (error) {
            // Log the error and do not send the success message
            Logger.log("Failed to delete spam emails: " + error.message);
        }
    } else {
        // sendMsgToTelegram("No spam emails to delete.")
    }
}

function sendMsgToTelegram(message) {
    var botToken = botToken; // Replace with your bot token
    var chatId = chatId; // Replace with your chat ID

    var url = "https://api.telegram.org/bot" + botToken + "/sendMessage";

    var payload = {
        "chat_id": chatId,
        "text": message
    };

    var options = {
        "method": "post",
        "payload": payload
    };

    UrlFetchApp.fetch(url, options);
}

checkMultipleCategories()

function checkMultipleCategories() {
    var msg = "";
    var categoryArr = ['promotions', 'social', 'updates', 'forums']
    for (var i = 0; i < categoryArr.length; i++) {
        var category = categoryArr[i];
        msg = msg + checkCategory(category);
    }

    Logger.log(msg);
    sendMsgToTelegram(msg);
}


function checkCategory(name) {
    // Search for emails in the Promotions category
    var threads = GmailApp.search(`category:${name}`);
    var emailCount = threads.length;
    var message;

    if (emailCount > 0) {
        message = "You have " + emailCount + " emails in the " + name + " category.\n";
    } else {
        message = "No emails found in the " + name + " category.\n";
    }

    return message;
}




