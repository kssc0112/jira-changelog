var Haikunator = require('haikunator')

module.exports = {

  // Jira integration
  jira: {

    // API
    api: {
      // Root host of your JIRA installation without protocol.
      // (i.e 'yourapp.atlassian.net')
      host: undefined,
      // Email address of the user to login with
      email: undefined,
      // Auth token of the user to login with
      // https://confluence.atlassian.com/cloud/api-tokens-938839638.html
      token: undefined,
    },

    // Jira base web URL
    // Set to the base URL for your Jira account
    baseUrl: 'https://atlassian.net',

    // Regex used to match the issue ticket key
    // Use capture group one to isolate the key text within surrounding characters (if needed).
    ticketIDPattern: /([A-Z]+\-[0-9]+)/i,

    // Status names that mean the ticket is approved.
    approvalStatus: ['Done', 'Closed', 'Accepted'],

    // Tickets to exclude from the changelog, by type name
    excludeIssueTypes: ['Sub-task'],

    // Tickets to include in changelog, by type name.
    // If this is defined, `excludeIssueTypes` is ignored.
    includeIssueTypes: [],

    // Get the release version name to use when using `--release` without a value.
    // Returns a Promise
    generateReleaseVersionName: function() {
      const haikunator = new Haikunator();
      return Promise.resolve(haikunator.haikunate());
    }
  },

  // Slack API integration
  slack: {

    // API key string
    apiKey: undefined,

    // The channel that the changelog will be posted in, when you use the `--slack` flag.
    // This can be a channel string ('#mychannel`) or a channel ID.
    channel: undefined,

    // The name to give the slack bot user, when posting the changelog
    username: "Changelog Bot",

    // Emoji to use for the bot icon.
    // Cannot be used at the same time as `icon_url`
    icon_emoji: ":clipboard:",

    // URL to an image to use as the icon for the bot.
    // Cannot be used at the same time as `icon_emoji`
    icon_url: undefined
  },

  // Github settings
  sourceControl: {

    // Default range for commits.
    // This can include from/to git commit references
    // and or after/before datestamps.
    defaultRange: {
      from: "origin/prod",
      to: "origin/stage"
    }
  },

  // Transforms the basic changelog data before it goes to the template.
  //  data - The changlelog data.
  transformData: function(data) {
    return Promise.resolve(data);
  },

  // Transform the changelog before posting to slack
  //  content - The changelog content which was output by the command
  //  data - The data which generated the changelog content.
  transformForSlack: function(content, data) {
    return Promise.resolve(content);
  },

  // The template that generates the output, as an ejs template.
  // Learn more: http://ejs.co/
  template:
`<% tickets.all.forEach((ticket) => {%>
  * [<%= ticket.key %>]<%= '(' + jira.baseUrl + '/browse/' + ticket.key + '): ' %><%- ticket.fields.summary -%>
  <% }); -%>
  <% if (!tickets.all.length) {%> ~ None ~ <% } %>`
};
