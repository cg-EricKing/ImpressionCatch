// Zero Impression Catch

// Alert if zero impressions - If impressions are 0, send campagin name, account name, to spreadsheet

// Init main function
function main () {
// Init spreadsheet
var spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1Pe-UQpGIV5kd_UbLQVd2dlf0950VqSvpmCSB6y4t6fw/edit?usp=sharing';
// Log spreadsheet url
Logger.log('Using spreadsheet - %s.', spreadsheet_url);
// open ss
var spreadsheet = SpreadsheetApp.openByUrl(spreadsheet_url);
var sheet = spreadsheet.getSheets()[0];

// select current account - get account name and return it
var currentAccount = AdWordsApp.currentAccount();
var accountName = currentAccount.getName();
Logger.log("Account Name: " + accountName);
// Email for notify function
var emailForNotify = "eric.king@comporium.com";

// Campaign Selector - look for enabled campaigns 
var campaignSelector = AdWordsApp
  .campaigns()
  .withCondition("Status = ENABLED");

var campaignIterator = campaignSelector.get();
while (campaignIterator.hasNext()) {
  var campaign = campaignIterator.next();
  var campaignName = campaign.getName();
  Logger.log("Campaign Name: " + campaignName);
  var stats = campaign.getStatsFor("ALL_TIME");

  var impressions = stats.getImpressions();

  // Check impressions for all time - if 0 - add to sheet
  // Else log everything is good impressions are growing
  if (impressions === 0) {
    Logger.log("Impressions are still at 0 - please look into this campaign.")
    sheet.appendRow([accountName, campaignName, impressions]);
    notify("Impressions for this campaign are still at 0, after starting - please look into this campaign.")
  } else {
    Logger.log("Campaign has gained impressions and launched, no adjustment necessary.")
  }
}


// Email function to pass string and send through to email provided
function notify(string) {
  // Construct email template for notifications
  // Must have to, subject, htmlBody
  var emailTemplate = {
      to: emailForNotify,
      subject: accountName,
      htmlBody: "<h1>Comporium Media Services Automation Scripts</h1>" + "<br>" + "<p>This account has encountered an issue</p>" + accountName +
      "<br>" + "<p>The issue is with this campaign: </p>" + campaignName + "<br>" + "<p>This is what is wrong - </p>" + "<br>"
      + string + "<p>Total Impressions Currently: " + impressions + "<br>" +"<p>If something is incorrect with this notification please contact Eric King. Thanks!</p>"
  }
      MailApp.sendEmail(emailTemplate);
  }

}



