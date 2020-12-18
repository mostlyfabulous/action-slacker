const core = require('@actions/core');

const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK;
const slack = require('slack-notify')(SLACK_WEBHOOK);

slack.onError = function (err) {
  core.error(`Error ${err}, action may still succeed though`);
};

// most @actions toolkit packages have async methods
async function run() {
  try {
    let attachment = {};
    attachment.fallback = core.getInput('fallback', {
      required: false
    });
    attachment.color = core.getInput('color', {
      required: false
    });
    attachment.pretext = core.getInput('pretext', {
      required: false
    });
    attachment.author_name = core.getInput('author_name', {
      required: false
    });
    attachment.author_link = core.getInput('author_link', {
      required: false
    });
    attachment.author_icon = core.getInput('author_icon', {
      required: false
    });
    attachment.title = core.getInput('title', {
      required: false
    });
    attachment.title_link = core.getInput('title_link', {
      required: false
    });
    attachment.text = core.getInput('text', {
      required: false
    });
    attachment.image_url = core.getInput('image_url', {
      required: false
    });
    attachment.thumb_url = core.getInput('thumb_url', {
      required: false
    });
    attachment.footer = core.getInput('footer', {
      required: false
    });
    attachment.footer_icon = core.getInput('footer_icon', {
      required: false
    });

    const channel = core.getInput('channel', {
      required: true
    });
    const icon_url = core.getInput('icon_url', {
      required: true
    });
    const username = core.getInput('username', {
      required: true
    });

    const testOutputObject = JSON.parse(attachment.text);

    let textContent = testOutputObject.text;
    let textContentOverLength = 0;
    if (textContent.length > 3000) {
      console.log("text is too long");
      textContent = textContent.substring(0, 3000);
      textContentOverLength = textContent.length - 3000;
      console.log("characters: " + textContentOverLength);
    }

    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: textContent
        }
      }
    ];

    if (textContentOverLength > 0) {
      console.log("adding second block");
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Test result is " + textContentOverLength + " characters too long to show. Check results in the link below"
        }
      });
    }

    slack.send({
      channel: channel,
      icon_url: icon_url,
      username: username,
      text: `GitHub action (${process.env.GITHUB_WORKFLOW}) triggered\n`,
      blocks: blocks,
      attachments: [
        {
          "color": attachment.color,
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": `<${attachment.title_link}|${attachment.title}>`
              }
            }
          ]
        }
      ]
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()
