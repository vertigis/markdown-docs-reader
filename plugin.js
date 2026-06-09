var __init;
__init();

__init = function() {
    function argsFromHash(hash) {
        const index = hash.indexOf("?");
        if (index >= 0) {
            return new URLSearchParams(hash.slice(index + 1));
        }

        return new URLSearchParams();
    }

    let timer;
    const list = [];
    function scrolling(_, delay = 300) {
        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(function() {
            timer = undefined;

            let last = list[0];
            const root = document.querySelector(".content");
            const view = root.getBoundingClientRect(); 
            const mid = (view.top + view.bottom) / 2;
            for (const el of list) {
                const rect = el.getBoundingClientRect();
                if (rect.top > view.top - 3) {
                    if (rect.top < mid) {
                        last = el;
                    }

                    break;
                }

                last = el;
            }

            const id = last.id;
            const hash = location.hash.replace(/\?.*/, "");
            history.replaceState(null, null, `${hash}?id=${id}`);

            const current = document.querySelector(".sidebar .active");
            if (current) {
                current.classList.remove("active");
            }

            for (const el of document.querySelectorAll(".sidebar a")) {
                if (el.href === location.href) {
                    el.parentElement.classList.add("active");
                }
            }
        }, delay);
    }

    function scrollToPart() {
        const args = argsFromHash(location.hash);
        const id = args.get("id") || "_top";
        const target = document.getElementById(id);
        const scroller = document.querySelector(".content");
        if (target) {
            target.scrollIntoView({
                block: "start",
                behavior: "instant"
            });

            return;
        }

        scroller.scrollTo({
            top: 0,
            behavior: "instant"
        });
    }

    addEventListener("hashchange", scrollToPart);

    if (location.hash === "") {
        history.replaceState(null, null, "#/home/README.md");
    }

    let cleanup;
    function updateHash() {
        if (cleanup) {
            cleanup();
        }        

        const root = document.querySelector(".content");
        root.addEventListener("scroll", scrolling, { passive: true });

        cleanup = function() {
            list.length = 0;
            root.removeEventListener("scroll", scrolling);

            if (timer) {
                clearTimeout(timer);
                timer = undefined;
            }
        };

        for (const el of document.querySelectorAll(".content h1, .content h2, .content h3")) {
            list.push(el);
        }
        
        scrolling(null, 0);
    }

    function addCopyButtons() {
        for (const pre of document.querySelectorAll(".content pre code")) {
            let text = [];
            let line = [];
            let prefix = "";
            const lines = [];
            const walker = document.createTreeWalker(pre, NodeFilter.SHOW_ALL);
            while (walker.nextNode()) {
                const node = walker.currentNode;
                if (node.parentNode === pre) {
                    line.push(node);
                }

                if (node.nodeType === Node.TEXT_NODE) {
                    if (prefix) {
                        node.data = prefix + node.data;
                        prefix = "";
                    }

                    const parts = node.data.split("\n");
                    if (parts.length > 1) {
                        prefix = parts.pop();
                        node.data = parts.shift();
                        text.push(node.data);

                        lines.push([text.join(""), line]);

                        for (const part of parts) {
                            lines.push([part, [part]]);
                        }

                        text = [];
                        line = [];
                    }
                    else {
                        text.push(node.data);
                    }
                }
            }

            if (line.length > 0) {
                lines.push([text.join(""), line]);
            }

            if (prefix) {
                lines.push([prefix, [prefix]]);
            }

            const fullText = lines.map(function([text]) {
                return text;
            }).join("\n");

            pre.innerHTML = "";

            const fullCopy = document.createElement("button");
            fullCopy.className = "copy-button full-copy-button";
            fullCopy.dataset.label = "copy all";
            fullCopy.addEventListener("click", function() {
                navigator.clipboard.writeText(fullText);

                const root = pre.parentElement;
                root.classList.add("copying");
                setTimeout(function() {
                    root.classList.remove("copying");
                }, 100);
            });
            pre.parentElement.append(fullCopy);

            let group;
            for (const [text, line] of lines) {
                let comment = false;
                let single = false;
                let space = false;
                let end = false;
                if (text[0] === "#") {
                    end = true;
                    single = true;
                    comment = true;
                }

                if (text.trim() === "") {
                    end = true;
                    single = true;
                    space = true;
                }

                if (!space && text[0].trim()) {
                    end = true;
                }

                if (group && end) {
                    pre.append(group);
                    group = undefined;
                }

                let first = false;
                if (!group) {
                    first = true;
                    group = document.createElement("div");
                    group.className = "code-segment";
                }
                else {
                    group.append("\n");
                }

                if (comment) {
                    group.className = "code-comment";
                }
                else if (space) {
                    group.className = "code-space";
                }

                if (space) {
                    group.append("\n");
                }
                else {
                    for (const node of line) {
                        group.append(node);
                    }
                }
               
                if (single) {
                    pre.append(group);
                    group = undefined;
                }
                else if (first) {
                    const copy = document.createElement("button");
                    copy.className = "copy-button";
                    copy.dataset.label = "copy";
                    group.append(copy);

                    const which = group;
                    copy.addEventListener("click", function() {
                        const text = which.innerText;
                        navigator.clipboard.writeText(text);

                        which.classList.add("copying");
                        setTimeout(function() {
                            which.classList.remove("copying");
                        }, 100);
                    });
                }
            }

            if (group) {
                pre.append(group);
            }
        }
    }

    function fixLinks() {
        const root = "" + new URL("./", location.href);
        for (const a of document.querySelectorAll("a")) {
            const url = new URL(a.href);
            const args = argsFromHash(url.hash);
            url.search = url.hash = "";

            if (url.href.startsWith(root)) {
                args.delete("id");
                a.target = "";

                if (args.size) {
                    a.href = "?" + args;
                }
            }
        }
    }

    const config = window.$docsify || {};
    const alias = config.alias || {};
    const plugins = config.plugins || [];
    window.$docsify = Object.assign(config, {
        loadNavbar: true,
        maxLevel: 3,
        routerMode: "hash",
        relativePath: true,
        alias: {
            ".*/_navbar.md": "_navbar.md",
            ...alias,
        },
        plugins,
    });

    plugins.push(function(hook) {
        hook.doneEach(scrollToPart);
        hook.doneEach(updateHash);
        hook.doneEach(addCopyButtons);
        hook.doneEach(fixLinks);
    });
};

__init();
__init = undefined;