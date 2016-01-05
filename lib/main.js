var data = require("self").data;
var pageMod = require("page-mod");

pageMod.PageMod({
  include: [ /.*tpondemand.com\/.*/ ],
  contentScriptFile: data.url("index.js"),
  contentScriptWhen: "ready"
});
