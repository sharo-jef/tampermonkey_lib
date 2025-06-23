function waitForElement(selector) {
  return new Promise((resolve) => {
    const existing = document.querySelector(selector);
    if (existing) {
      resolve(existing);
      return;
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1 && node.matches(selector)) {
            observer.disconnect();
            resolve(node);
            return;
          }
          if (node.nodeType === 1) {
            const match = node.querySelector(selector);
            if (match) {
              observer.disconnect();
              resolve(match);
              return;
            }
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

function observeElements(selector, callback) {
  document.querySelectorAll(selector).forEach(callback);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;

        if (node.matches(selector)) {
          callback(node);
        }

        node.querySelectorAll?.(selector).forEach(callback);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return observer;
}
