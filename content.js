const domain = window.location.hostname;
const buttonLabel = 'Create ORT Task';
const timeout = 1200;

const contents = {
  projectName: getProjectName(),
  taskName: getTaskName(),
  url: window.location.href,
};

const generateTask = async () => {
  if (domain !== "github.com") {
    alert("This script only works on GitHub.");

    return;
  }

  const template = `
[Project] ${contents.projectName}
[Task] ${contents.taskName}
[Assignee] @ort-frontend
[Reference] ${contents.url}
  `;

  await navigator.clipboard.writeText(template.trim());
}

function getProjectName() {
  const selectors =
    "context-region-crumb:nth-of-type(2) .AppHeader-context-item-label";
  const el = document.querySelector(selectors);

  const content = el?.textContent.trim() ?? "";

  const formatContent = content
    .split("-")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1).trim())
    .join(" ");

  return formatContent
}

function getTaskName() {
  const el = document.querySelector(".markdown-title");

  const content = el?.textContent.trim() ?? "";

  return content
}

async function getButtonHtml() {
  try {
    const htmlUrl = chrome.runtime.getURL("button.html");
    const htmlText = await fetch(htmlUrl).then(res => res.text());

    return htmlText;
  } catch (error) {
    console.error(error);
  }
}

async function getButtonStyle() {
  try {
    const cssUrl = chrome.runtime.getURL("button.css");
    const cssText = await fetch(cssUrl).then(res => res.text());

    return cssText;
  } catch (error) {
    console.error(error);
  }
}

async function injectButton() {
  try {
    const html = await getButtonHtml();
    const style = await getButtonStyle();

    const styleEl = document.createElement("style");
    styleEl.textContent = style;
    document.head.appendChild(styleEl);

    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    document.querySelector('.gh-header-actions').prepend(wrapper);
  } catch (error) {
    console.error(error);
  }

  const btn = document.querySelector('#create-ort-task-btn');

  btn.onclick = async function () {
    try {
      await generateTask();
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = buttonLabel, timeout);
    } catch (error) {
      btn.textContent = 'Error!';
      setTimeout(() => btn.textContent = buttonLabel, timeout);
    }
  };
}

injectButton();