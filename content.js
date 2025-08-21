(function() {
    const domain = window.location.hostname;
    const isGitHub = domain === "github.com";
    const isPullRequest = window.location.pathname.includes("/pull/");

    if (!isGitHub || !isPullRequest) {
        return;
    }

    function getCleanPullRequestUrl() {
        const prUrlMatch = window.location.href.match(/(.*\/pull\/\d+)/);
        return prUrlMatch ? prUrlMatch[0] : window.location.href;
    }

    const contents = {
        projectName: getProjectName(),
        taskName: getTaskName(),
        url: getCleanPullRequestUrl(),
    };

    const generateTask = async () => {
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

    function placeButton() {
        const headerActions = document.querySelector('.gh-header-actions');
        if (!headerActions) {
            // If the header is not found, try again after a short delay
            setTimeout(placeButton, 500);
            return;
        }
        
        // Check if the button already exists
        if (document.getElementById('copy-task-btn')) {
            return;
        }

        const btn = document.createElement('button');
        btn.id = 'copy-task-btn';
        btn.textContent = 'Generate ORT Report';
        btn.classList.add('Button', 'Button--primary', 'Button--small');
        btn.style.marginLeft = '8px';

        btn.onclick = async function () {
            try {
                contents.url = getCleanPullRequestUrl();
                await generateTask();
                btn.textContent = 'Copied!';
                setTimeout(() => btn.textContent = 'Generate ORT Report', 1200);
            } catch (error) {
                btn.textContent = 'Error!';
                setTimeout(() => btn.textContent = 'Generate ORT Report', 1200);
            }
        };

        headerActions.appendChild(btn);
    }

    // GitHub sometimes loads content dynamically, so we need to be robust.
    // We'll observe for changes in the body and place the button when the header is available.
    const observer = new MutationObserver((mutations, obs) => {
        const headerActions = document.querySelector('.gh-header-actions');
        if (headerActions) {
            placeButton();
            obs.disconnect(); // Stop observing once the button is placed.
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
