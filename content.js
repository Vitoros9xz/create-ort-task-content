chrome.runtime.onMessage.addListener((request) => {
  const domain = window.location.hostname;

  if (domain !== "github.com") {
    alert("This script only works on GitHub.");

    return;
  }

  if (request.action !== "getContent") {
    return;
  }

  const contents = {
    projectName: getProjectName(),
    taskName: getTaskName(),
    url: window.location.href,
  };

  const template = `
[Project] ${contents.projectName}
[Task] ${contents.taskName}
[Assignee] @ort-frontend
[Reference] ${contents.url}
  `;

  navigator.clipboard
    .writeText(template.trim())
    .then(() => {
      alert("Content copied to clipboard!");
    })
    .catch((err) => {
      alert("Failed to copy: ", err);
    });
});

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
