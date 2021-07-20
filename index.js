
window.DEBUGGING = false;

localStorage.setItem("version", 0);

import * as pages from "./core/Page.js";
pages.init();
pages.welcome.show();
