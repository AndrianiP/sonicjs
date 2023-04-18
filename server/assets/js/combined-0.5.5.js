      data-template-region=${s} data-template-page=${a}>${o}</div>`}})(typeof exports==="undefined"?this["formattingService"]={}:exports);var verboseLogging=false;if(typeof module!=="undefined"&&module.exports){var emitterService=require("./emitter.service");var globalService=require("./global.service");var pageBuilderService=require("./page-builder.service");var formService=require("./form.service");var helperService=require("./helper.service");var formattingService=require("./formatting.service");var _=require("underscore");var axios=require("axios");var fs=require("fs");var ShortcodeTree=require("shortcode-tree").ShortcodeTree;var chalk=require("chalk");var{GraphQLClient,gql,request}=require("graphql-request");verboseLogging=process.env.APP_LOGGING==="verbose";var log=console.log}else{const defaultOptions={headers:{},baseURL:globalService.baseUrl};let e=axios.create(defaultOptions)}(function(e){var a="/graphql/";var t="";var n;var i;var r;e.startup=async function(){emitterService.on("requestBegin",async function(t){if(t){const e={headers:{},baseURL:globalService.baseUrl};if(t.req.signedCookies&&t.req.signedCookies.sonicjs_access_token){e.headers.Authorization=t.req.signedCookies.sonicjs_access_token}r=axios.create(e)}})},e.executeGraphqlQuery=async function(e){const t=`${globalService.baseUrl}/graphql`;const n=new GraphQLClient(t,{headers:{authorization:"Bearer MY_TOKEN"}});const i=n.request(e);return i},e.getAxios=function(){if(!r){const e={headers:{"Content-Type":"application/json"},withCredentials:true,baseURL:globalService.baseUrl,cookie:"sonicjs=s%3AMmvj7HC35YSG-RP1WEY6G3NS7mrSRFcN.EoldLokzB5IMX34xGLC2QwbU0HZn2dSFmtQ9BhPB26w"};let t=helperService.getCookie("sonicjs_access_token");if(t){e.headers.Authorization=t}r=axios.create(e);r.defaults.withCredentials=true}return r},e.userCreate=async function(e,t){};e.userUpdate=async function(e,t){let n=e.id;delete e.id;let i=JSON.stringify(e);let r=await this.getAxios().post(a,{query:`
        mutation{
          userUpdate( 
            id:"${n}", 
            profile:"""${i}""",
            sessionID:"${t}"){
              username
          }
        }
            `});return r.data},e.userDelete=async function(e,t){debugger;let n=`
      mutation{
        userDelete( 
          id:"${e}",
          sessionID:"${t}"){
            id
          }
      }
          `;let i=await this.getAxios().post(a,{query:n});return i.data.data.userDelete},e.rolesGet=async function(e){let t=await this.getAxios().post(a,{query:`
      {
        roles (sessionID:"${e}"){
          id
          data
        }
      }
        `});if(t.data.data.roles){return t.data.data.roles}},e.getContent=async function(e){let t=await this.getAxios().post(a,{query:`
        {
          contents (sessionID:"${e}")
          {
            id
            contentTypeId
            data
            createdByUserId {
              id
              username
            }
            createdOn
            lastUpdatedByUserId {
              id
              username
            }	
            updatedOn
          }
        }
          `});if(t.data.data.contents){let e=t.data.data.contents;await formattingService.formatDates(e);await formattingService.formatTitles(e);return e}},e.getContentAdminCommon=async function(e){let t=await this.getContent(e);let n=_.sortBy(t,"updatedOn");let i=n.filter(e=>e.contentTypeId==="page"||e.contentTypeId==="blog");return i},e.getContentAdmin=async function(e){let t=await this.getContent(e);let n=_.sortBy(t,"updatedOn");return n},e.getContentByType=async function(e,t){let n=await this.getAxios().post(a,{query:`
        {
          contents (contentTypeId : "${e}", sessionID:"${t}") {
            id
            contentTypeId
            data
            createdOn
          }
        }
            `});return n.data.data.contents},e.getPageTemplates=async function(e){let t=await this.getContentByType("page",e);let n=t.filter(e=>e.data.isPageTemplate);return n},e.contentTypeGet=async function(e,t){let n=await this.getAxios().post(a,{query:`
            {
                contentType(systemId:"${e}", sessionID:"${t}") {
                  title
                  systemId
                  moduleSystemId
                  filePath
                  data
                  permissions
                }
              }
            `});return n.data.data.contentType},e.contentTypesGet=async function(e){let t=await this.getAxios().post(a,{query:`
        {
          contentTypes (sessionID:"${e}") {
            title
            systemId
            moduleSystemId
            filePath
            data
          }
        }
          `});return t.data.data.contentTypes},e.queryfy=function(t){if(typeof t==="number"){return t}if(Array.isArray(t)){const e=t.map(e=>`${queryfy(e)}`).join(",");return`[${e}]`}if(typeof t==="object"){const e=Object.keys(t).map(e=>`${e}:${queryfy(t[e])}`).join(",");return`{${e}}`}return JSON.stringify(t)},e.contentTypeUpdate=async function(e,t){let n=JSON.stringify(e.data);let i=JSON.stringify(e.permissions);let r=`
      mutation{
        contentTypeUpdate( 
          title:"${e.title}", 
          moduleSystemId:"${e.moduleSystemId}", 
          systemId:"${e.systemId}", 
          permissions:"""${i}""",
          data:"""${n}""",
          sessionID:"${t}"){
            title
        }
      }
          `;let o=await this.getAxios().post(a,{query:r});return o.data.data.contentType},e.contentTypeDelete=async function(e,t){let n=JSON.stringify(e.data);let i=await this.getAxios().post(a,{query:`
        mutation{
          contentTypeDelete( 
            systemId:"${e}", sessionID:"${t}"){
              title
          }
        }
            `});return i.data.data.contentType},e.contentTypeCreate=async function(e,t){let n=`
      mutation{
        contentTypeCreate( 
          title:"${e.title}", 
          moduleSystemId:"${e.moduleSystemId}", 
          systemId:"${e.systemId}",
          sessionID:"${t}")
          {
            title
        }
      }
          `;let i=await this.getAxios().post(a,{query:n});return i.data.data.contentType},e.getContentTopOne=async function(e,t){let n=await this.getContentByType(e,t);if(n){return n[0]}else{throw new Error(`Could not find element getContentTopOne: ${e}, ${t}`)}},e.getContentByUrl=async function(e,t){let n=await this.getAxios().post(a,{query:`
            {
              content(url: "${e}", sessionID:"${t}") {
                id
                contentTypeId
                data
              }
            }
          `});if(n.data.data.content){return n.data.data.content}let i={data:{}};i.data.title="Not Found";i.data.body="Not Found";i.data.status="Not Found";i.url=e;return i},e.getContentByContentType=async function(e,t){let n=`
      {
        contents(contentTypeId: "${e}", sessionID:"${t}") {
          id
          contentTypeId
          data
        }
      }
    `;let i=await this.getAxios().post(a,{query:n});if(i.data.data.contents){return i.data.data.contents}return"notFound"},e.getContentByContentTypeAndTitle=async function(e,t,n){let i=await this.getContentByContentType(e,n);if(i){let e=i.filter(e=>e.data.title.toLowerCase()===t.toLowerCase())[0];return e}},e.getContentByContentTypeAndTag=async function(e,t,n){let i=await this.getContentByContentType(e);if(i){let e=i.filter(e=>e.data.tags.includes(t.id));return e}},e.getContentByUrlAndContentType=async function(e,t,n){const i=`{"where":{"and":[{"url":"${t}"},{"data.contentType":"${e}"}]}}`;const r=encodeURI(i);let o=`${a}content?filter=${r}`;let s=await this.getAxios().get(o);if(s.data[0]){return s}return"not found"},e.editInstance=async function(e,t){let n=e.id;if(e.id){delete e.id}if(e.data&&e.data.id){n=e.data.id;delete e.data.id}let i=e.data;if(!i){i=e}let r=JSON.stringify(i);let o=`
      mutation{
        contentUpdate( 
          id:"${n}", 
          url:"${i.url}", 
          data:"""${r}""",
          sessionID:"${t}"){
            id
            url
            contentTypeId
        }
      }
          `;let s=await this.getAxios().post(a,{query:o});return s.data.data.contentUpdate},e.contentCreate=async function(e,t=true,n){if(e.data.contentType!=="page"&&e.data.contentType!=="blog"){if(t){e.data.url=helperService.generateSlugFromContent(e.data,true,true)}}let i=`
      mutation{
        contentCreate( 
          contentTypeId:"${e.data.contentType}", 
          url:"${e.data.url}", 
          data:"""${JSON.stringify(e.data)}""",
          sessionID:"${n}"){
            id
            url
            contentTypeId
        }
      }
          `;if(verboseLogging){console.log("contentCreate query ===>",i)}let r=await this.getAxios().post(a,{query:i});if(emitterService){emitterService.emit("contentCreated",r)}if(r.data.errors){console.error("contentCreate error ===>",JSON.stringify(r.data.errors))}if(verboseLogging){console.log("contentCreate result ===>",JSON.stringify(r.data))}return r.data.data.contentCreate};e.contentDelete=async function(e,t){let n=`
      mutation{
        contentDelete( 
          id:"${e}",
          sessionID:"${t}"){
            id
          }
      }
          `;let i=await this.getAxios().post(a,{query:n});return i.data.data.contentCreate};e.getContentById=async function(e,t){let n=await this.getAxios().post(a,{query:`
        {
          content(id: "${e}",
          sessionID:"${t}") {
            contentTypeId
            data
            id
            url
          }
        }
          `});if(n.data.data.content){n.data.data.content.data.id=n.data.data.content.id;n.data.data.content.data.contentType=n.data.data.content.contentTypeId;return n.data.data.content}},e.fileUpdate=async function(e,t,n){let i=await this.getAxios().post(a,{query:`
      mutation{
        fileUpdate( 
          filePath:"${e}", 
          fileContent:"""${t}""",
          sessionID:"${n}"
          )
          { 
            filePath 
          }
      }
          `});return i.data.data.fileUpdate},e.fileCreate=async function(e,t,n){let i=`
      mutation{
        fileCreate( 
          filePath:"${e}", 
          fileContent:"""${t}""",
          sessionID:"${n}"
          )
          { 
            filePath 
          }
      }
          `;let r=t.length;let o=await this.getAxios().post(a,{query:i});return o.data.data.fileUpdate},e.getView=async function(e,t,n,i){let r=await this.getAxios().post(a,{query:`
        {
          view(
            contentType:"${e}",
            viewModel: """${JSON.stringify(t)}""",
            viewPath:"${n}",
            sessionID:"${i}"
          ) {
          html
        }
      }
          `});if(r.data.data.view.html){return r.data.data.view.html}return notFound},e.asyncForEach=async function(t,n){for(let e=0;e<t.length;e++){await n(t[e],e,t)}},e.getImage=function(e){let t=this.getImageUrl(e);return`<img class="img-fluid rounded" src="${t}" />`},e.deleteModule=async function(e,t){let n=`
      mutation{
        moduleTypeDelete( 
          systemId:"${e}",
          sessionID:"${t}")
          { systemId }
      }
          `;let i=await this.getAxios().post(a,{query:n})},e.moduleCreate=async function(e,t){let n=await this.getAxios().post(a,{query:`
        mutation{
          moduleTypeCreate(
            title:"${e.data.title}", 
            enabled:${e.data.enabled}, 
            systemId:"${e.data.systemId}", 
            canBeAddedToColumn: ${e.data.canBeAddedToColumn},
            sessionID:"${t}"
            )
          {		
            title
            enabled
            systemId
            canBeAddedToColumn
          }
        }
          `});return n.data.data.fileUpdate},e.moduleEdit=async function(e,t){let n=await this.getAxios().post(a,{query:`
        mutation{
          moduleTypeUpdate(
            title:"${e.data.title}", 
            enabled:${e.data.enabled}, 
            systemId:"${e.data.systemId}", 
            canBeAddedToColumn: ${e.data.canBeAddedToColumn},
            singleInstance: ${e.data.singleInstance},
            version:"${e.data.version}"
            )
          {		
            title
            enabled
            systemId
            canBeAddedToColumn
          }
        }
          `});return n.data.data},e.mediaDelete=async function(e,t){let n=`
        mutation{
          mediaDelete( 
            id:"${e}",
            sessionID:"${t}"){
              id
            }
        }
            `;let i=await this.getAxios().post(a,{query:n});return i.data.data.mediaDelete};e.getFiles=async function(){let e=[{title:"my image",filePath:"/images/test123.png"}];return e}})(typeof exports==="undefined"?this["dataService"]={}:exports);isBackEndMode=false;var axiosInstance;if(typeof module!=="undefined"&&module.exports){isBackEndMode=true;var dataService=require("./data.service");var emitterService=require("./emitter.service");var helperService=require("./helper.service");var globalService=require("./global.service");var multipart=require("connect-multiparty");var _=require("underscore");var appRoot=require("app-root-path");var fs=require("fs");var axios=require("axios");const ShortcodeTree=require("shortcode-tree").ShortcodeTree;const chalk=require("chalk");const log=console.log;const Formio={};const document={getElementById:{}}}else{}(function(f){f.startup=async function(e){emitterService.on("requestBegin",async function(t){if(t){const e={headers:{},baseURL:globalService.baseUrl};if(t.req.signedCookies&&t.req.signedCookies.sonicjs_access_token){e.headers.Authorization=t.req.signedCookies.sonicjs_access_token}axiosInstance=axios.create(e)}});emitterService.on("getRenderedPagePostDataFetch",async function(e){if(e&&e.page){e.page.data.editForm=await f.getForm(e.page.contentTypeId,null,"submitContent(submission)",undefined,undefined,e.req.sessionID)}});e.get("/form",async function(e,t){t.send("form ok")});var t=require("connect-multiparty");e.use(t({uploadDir:`${appRoot.path}/server/temp`}));e.post("/video-upload",async function(e,t,n){let i=e.files.file.path;t.cookie("videoPath",i,{maxAge:9e5,httpOnly:true});t.send(i)})},f.getForm=async function(e,t,n,c=false,i,r){let o;if(t&&t.data.contentType){o=await dataService.contentTypeGet(t.data.contentType.toLowerCase(),r)}else if(e){o=await dataService.contentTypeGet(e,r);if(i){o.data.components.unshift({type:"textfield",inputType:"text",key:"formSettingsId",defaultValue:i,hidden:false,input:true,customClass:"hide"})}if(c){const u=await dataService.contentTypeGet(`${e}-settings`,r);if(u&&u.data){o=u}}}else{return}if(!n){n="editInstance(submission,true)"}const d=await f.getFormJson(o,t);let s="";let a={viewModel:{},viewPath:"/server/assets/html/form.html"};a.viewModel.onFormSubmitFunction=n;a.viewModel.formJSON=JSON.stringify(d);let h=t&&t.data?t.data:{};a.viewModel.formValuesToLoad=JSON.stringify(h);a.viewModel.random=helperService.generateRandomString(8);a.viewPath="/server/assets/html/form.html";a.contentType="";let l=await dataService.getView("",a.viewModel,a.viewPath);if(l){s+=l}else{let e=await this.getFormTemplate();s+=e}return s},f.getFormJson=async function(e,t){let n=`${e.systemId}Form`;let i=await this.getFormSettings(e,t);let r=await this.getFormComponents(e,t);const o={components:r,name:n,settings:i};return o},f.getTemplate=async function(){let e=await this.getFormTemplate()},f.getFormTemplate=async function(){if(isBackEndMode){return this.getFormTemplateFileSystem()}else{let e=await globalService.axiosInstance.get("/html/form.html");return e.data}},f.getFormTemplateFileSystem=async function(){return new Promise((n,i)=>{let e="/server/assets/html/form.html";fs.readFile(e,"utf8",(e,t)=>{if(e){console.log(e);i(e)}else{n(t)}})})},f.getFormSettings=async function(e,t){let n={};if(isBackEndMode){n.recaptcha={isEnabled:"true",siteKey:process.env.RECAPTCHA_SITE_KEY}}return n},f.getFormComponents=async function(e,t){let n=e.data?.components;if(t){this.addBaseContentTypeFields(t.id,t.data.contentType,n)}else if(n){n.push({type:"hidden",key:"contentType",label:"contentType",defaultValue:e.systemId,hidden:false,input:true})}return n},f.addBaseContentTypeFields=function(e,t,n){if(n){n.push({type:"textfield",key:"id",label:"id",customClass:"hide",defaultValue:e,hidden:false,input:true})}};f.setFormApiUrls=async function(e){e.setProjectUrl(sharedService.getBaseUrl()+"/nested-forms-list");e.setBaseUrl(sharedService.getBaseUrl()+"/nested-forms-get")}})(typeof exports==="undefined"?this["formService"]={}:exports);var page={};var contentType;var contentTypeComponents;var axiosInstance;var imageList,tinyImageList,currentSectionId,currentSection,currentRow,currentRowIndex,currentColumn,currentColumnIndex,currentModuleId,currentModuleIndex,currentModuleContentType,jsonEditor,ShortcodeTree,jsonEditorRaw,sessionID,theme;$(document).ready(async function(){setupSessionID();setupThemeID();await setupAxiosInstance();setupUIHovers();setupUIClicks();setupClickEvents();setupJsonEditor();await setPage();await setContentType();setupJsonEditorContentTypeRaw();setupJsonRawSave();setupFormBuilder(contentType);await setupACEEditor();await setupDropZone();setupSortable();setupSidePanel();setupAdminMenuMinimizer()});function setupSessionID(){sessionID=$("#sessionID").val()}function setupThemeID(){theme=$("#theme").val()}async function setupAxiosInstance(){let e=window.location.protocol+"//"+window.location.host+"/";let t=$("#token").val();const n={headers:{Authorization:`${t}`},baseUrl:e};axiosInstance=axios.create(n)}async function setPage(){let e=$("#page-id").val();if(e){this.page=await dataService.getContentById(e)}}async function setContentType(){let e=$("#contentTypeId").val();if(e){this.contentType=await dataService.contentTypeGet(e,undefined)}}function axiosTest(){axiosInstance.get("/api/content").then(function(e){console.log(e)}).catch(function(e){console.log(e)}).finally(function(){})}function setupUIHovers(){$(".pb-section").on({mouseenter:function(){let e=getParentSectionId($(this));$(`section[id='${e}']`).addClass("section-highlight")},mouseleave:function(){let e=getParentSectionId($(this));$(`section[id='${e}']`).removeClass("section-highlight")}});$(".mini-layout .pb-row").on({mouseenter:function(){let e=getParentSectionId($(this));let t=$(this).index();getRow(e,t).addClass("row-highlight")},mouseleave:function(){let e=getParentSectionId($(this));let t=$(this).index();getRow(e,t).removeClass("row-highlight")}});$(".mini-layout .pb-row .col").on({mouseenter:function(){let e=getParentSectionId($(this));let t=getParentRow(this);let n=$(this).parent().index();let i=$(this).index()+1;getColumn(e,n,i).addClass("col-highlight")},mouseleave:function(){let e=getParentSectionId($(this));let t=getParentRow(this);let n=$(this).parent().index();let i=$(this).index()+1;getColumn(e,n,i).removeClass("col-highlight")}})}function disableUIHoversAndClicks(){$(".pb-section").off();$(".mini-layout .pb-row").off();$(".mini-layout .pb-row .col").off();$("section .row > *").off();$("section .row .module").off();removeAllHighlights();$(".edit-module").hide();$(".section-editor-button").hide()}function removeAllHighlights(){$(".row-highlight").removeClass("row-highlight");$(".col-highlight").removeClass("col-highlight");$(".block-edit").removeClass("block-edit");$("html").removeClass("pb")}function setupUIClicks(){$("html").addClass("pb");$(".mini-layout .pb-row").on({click:function(){currentSectionId=getParentSectionId($(this));currentRowIndex=$(this).index();console.log("currentRowIndex pbrow",currentRowIndex);currentRow=getRow(currentSectionId,currentRowIndex).addClass("row-highlight");$(".row-button").show().appendTo(currentRow)}});$(".mini-layout .pb-row .col").on({click:function(){currentSectionId=getParentSectionId($(this));currentRow=getParentRow(this);currentRowIndex=$(this).parent().index();console.log("currentRowIndex pbcol",currentRowIndex);currentColumnIndex=$(this).index()+1;currentColumn=getColumn(currentSectionId,currentRowIndex,currentColumnIndex).addClass("col-highlight");$(".col-button").show().appendTo(currentColumn)}});$("section .row > *").on({click:function(){$(".col-highlight").removeClass("col-highlight");$(".block-edit").removeClass("block-edit");currentSectionId=$(this).closest("section").data("id");currentRow=$(this).closest(".row")[0];$(this).closest(".row").addClass("row-highlight");currentRowIndex=$(this).closest(".row").index();console.log("currentRowIndex pbcol",currentRowIndex);currentColumnIndex=$(this).index()+1;currentColumn=$(this);currentColumn.addClass("col-highlight");$(".col-button").show().appendTo(currentColumn);$(".add-module").show().appendTo(currentColumn);$(".row-button").show().appendTo(currentRow)}});$("section .row .module").on({click:function(){let e=$(this).closest(".module");currentModuleId=e.data("id");currentModuleIndex=$(e).index();currentModuleContentType=e.data("content-type");currentSection=$(this)[0].closest("section");currentSectionId=currentSection.dataset.id;currentRow=$(this)[0].closest(".row");currentRowIndex=$(currentRow).index();currentColumn=$(this)[0].closest('div[class^="col"]');currentColumnIndex=$(currentColumn).index();console.log("moduleId",currentModuleId);$(".edit-module").show().appendTo(e)}})}function getParentSectionId(e){return $(e).closest(".pb-section").data("id")}function getRow(e,t){return $(`section[id='${e}'] .row:nth-child(${t})`)}function getParentRow(e){return $(e).closest(".row")}function getColumn(e,t,n){return getRow(e,t).find(`.col:nth-child(${n})`)}async function setupClickEvents(){setupSectionBackgroundEvents()}async function getCurrentSection(){currentSectionRecord=await dataService.getContentById(currentSectionId);return currentSectionRecord}async function setupSectionBackgroundEvents(){$(".section-background-editor button").on("click",async function(){let e=$(this).data("type");currentSectionId=$(this).data("section-id");setupColorPicker(currentSectionId);currentSectionRecord=await getCurrentSection();currentSectionRecord.data.background={type:e};showBackgroundTypeOptions(e,currentSectionId);editInstance(currentSectionRecord)})}async function setDefaultBackgroundSetting(e,t){e.data.background.color=t}async function showBackgroundTypeOptions(e,t){$("[id^=background-]").hide();let n=`[id='background-${e}'],[data-id='${t}']`;$(n).show()}async function setupColorPicker(n){const e=Pickr.create({el:`#backgroundColorPreview-${n}`,theme:"nano",swatches:["rgba(244, 67, 54, 1)","rgba(233, 30, 99, 0.95)","rgba(156, 39, 176, 0.9)","rgba(103, 58, 183, 0.85)","rgba(63, 81, 181, 0.8)","rgba(33, 150, 243, 0.75)","rgba(3, 169, 244, 0.7)","rgba(0, 188, 212, 0.7)","rgba(0, 150, 136, 0.75)","rgba(76, 175, 80, 0.8)","rgba(139, 195, 74, 0.85)","rgba(205, 220, 57, 0.9)","rgba(255, 235, 59, 0.95)","rgba(255, 193, 7, 1)"],components:{preview:true,opacity:true,hue:true,interaction:{hex:false,rgba:false,hsla:false,hsva:false,cmyk:false,input:true,clear:true,save:true}}});e.on("change",(e,t)=>{console.log("change",e,t);$(`section[data-id="${n}"]`).css("background-color",e.toHEXA())}).on("save",(e,t)=>{console.log("save",e,t)});var t=document.querySelector(`#backgroundColorPreview-${n}`)}function getHtmlHex(e){return e}async function addSection(){console.log("adding section");let e=await generateNewRow();let t=[e];let n=1;if(page.data.layout){n=page.data.layout.length+1}let i={title:`Section ${n}`,contentType:"section",rows:t};let r=await createInstance(i);if(!page.data.layout){page.data.layout=[]}page.data.layout.push(r.id);let o=await editInstance(page)}async function editSection(e){console.log(e);currentSectionRecord=await dataService.getContentById(e);currentSection=currentSectionRecord.data;console.log("currentSection",currentSection);loadJsonEditor();$("#sectoinEditorModal").appendTo("body").modal("show")}async function deleteSection(e,t){console.log("delete section",e,t);page.data.layout.splice(t,1);await editInstance(page);await deleteContentInstance(e);fullPageUpdate()}async function saveSection(){var e=jsonEditor.get();console.log("jsonEditor",e);await editInstance(e);fullPageUpdate()}async function generateNewRow(){let e=await generateNewColumn();let t={class:"row",columns:[e]};return t}async function generateNewColumn(){let e={class:"col",content:``};return e}async function addRow(){let e=await this.generateNewRow();let t=await dataService.getContentById(currentSectionId);t.data.rows.push(e);editInstance(t);fullPageUpdate()}async function addColumn(){let e=await dataService.getContentById(currentSectionId);console.log("secton",e);console.log("currentRowIndex",currentRowIndex);let t=await generateNewColumn();e.data.rows[currentRowIndex].columns.push(t);editInstance(e);fullPageUpdate()}async function deleteColumn(){let e=await dataService.getContentById(currentSectionId);e.data.rows[currentRowIndex].columns.splice(currentColumnIndex-1,1);editInstance(e);fullPageUpdate()}async function deleteRow(){let e=await dataService.getContentById(currentSectionId);debugger;e.data.rows.splice(currentRowIndex,1);editInstance(e);fullPageUpdate()}async function editColumnContent(){console.log(currentSectionId);editSection(currentSectionId)}async function deleteBlock(){let e=await dataService.getContentById(currentSectionId);e.data.rows[currentRowIndex].columns.splice(currentColumnIndex-1,1);editInstance(e);fullPageUpdate()}async function getContentInstance(e){return axiosInstance.get(`/api/content/${e}`).then(async function(e){return await e.data}).catch(function(e){console.log(e)})}async function createInstance(t,e=false,n="content"){console.log("payload",t);if(t.id||"id"in t){delete t.id}if(!t.data){let e={data:t};t=e}if(n==="Roles"){t=t.data}let i=await dataService.contentCreate(t);if(i&&i.contentTypeId==="page"){let e=globalService.isBackEnd();if(e){window.location.href=`/admin/content/edit/page/${i.id}`}else{window.location.href=t.data.url}}else if(e){fullPageUpdate()}return i}async function editInstance(e,t,n="content"){if(n==="user"){n="users"}dataService.editInstance(e,sessionID).then(async function(e){console.log("editInstance",e);if(e.contentTypeId==="page"&&!globalService.isBackEnd()){if(e.url){window.location.href=e.url}else{fullPageUpdate()}}else if(t){fullPageUpdate()}}).catch(function(e){console.log("editInstance",e)})}async function editInstanceUser(e,t,n="content"){await dataService.userUpdate(e);fullPageUpdate()}async function editContentType(e,t){dataService.contentTypeUpdate(e,t)}async function deleteContentInstance(e,t){await dataService.contentDelete(e,t)}async function deleteContentType(e){console.log("deleting content",e);axiosInstance.post(`/api/modules/deleteModuleContentType/`,{systemId:e}).then(async function(e){console.log(e)}).catch(function(e){console.log(e)})}async function userDelete(e,t){dataService.userDelete(e,t)}function processContentFields(e){return{id:e.id,data:e}}async function openForm(e,t){await setupPageSettings(e,t);$("#pageSettingsModal").appendTo("body").modal("show")}async function setupPageSettings(e,t,n){console.log("setupPageSettings");let i=$("#page-id").val();let r=[{type:"textfield",key:"firstName",label:"First Name",placeholder:"Enter your first name.",input:true},{type:"textfield",key:"lastName",label:"Last Name",placeholder:"Enter your last name",input:true},{type:"button",action:"submit",label:"Submit",theme:"primary"}];if(!this.page.data){console.log("no data");alert("no data");while(!this.page.data){console.log("now data is ready")}}console.log("this.page.data==>",this.page.data);let o={};let s=r;let a=undefined;if(e=="edit"&&t){o=this.page;a=await formService.getForm(t,o,"await submitContent(submission);",undefined,undefined,n)}if(e=="add"){s=r.filter(e=>e.key!=="id");a=await formService.getForm("page",undefined,"await submitContent(submission);",undefined,undefined,n)}$("#formio").html(a);loadModuleSettingForm();$("#genericModal").appendTo("body").modal("show");console.log("page settings loaded")}async function setupFormBuilder(t){let e=$("#formBuilder");if(!e.length){return}e.empty();Formio.icons="fontawesome";formService.setFormApiUrls(Formio);Formio.builder(document.getElementById("formBuilder"),null).then(async function(e){e.setForm({components:t.data.components});e.on("submit",async function(e){console.log("submission ->",e)});e.on("change",async function(e){if(e.components){contentTypeComponents=e.components;console.log("event ->",e)}})})}async function onContentTypeSave(){if(contentTypeComponents){console.log("contentTypeComponents",contentTypeComponents);contentType.data.components=contentTypeComponents;if(!contentType.id){contentType.id=$("#createContentTypeForm #id").val()}await editContentType(contentType,sessionID)}}async function onContentTypeRawSave(){var e=jsonEditorRaw.get();console.log("jsonEditor",e);await editContentType(e,sessionID);fullPageUpdate()}async function openNewContentTypeModal(){$("#newContentTypeModal").appendTo("body").modal("show")}async function openNewRoleModal(){$("#newRoleModal").appendTo("body").modal("show")}async function openWYSIWYG(){console.log("WYSIWYG setup");var e=$(".block-edit").data("id");console.log("span clicked "+e);$("#block-edit-it").val(e);$("#wysiwygModal").appendTo("body").modal("show");var t=await dataService.getContentById(e);$("textarea.wysiwyg-content").html(t.data.body);$(document).on("focusin",function(e){if($(e.target).closest(".tox-dialog").length){e.stopImmediatePropagation()}});tinymce.remove();$("textarea.wysiwyg-content").tinymce({selector:"#block-content",height:600,plugins:"image imagetools code",toolbar:"code | formatselect | bold italic strikethrough forecolor backcolor permanentpen formatpainter | link image media pageembed | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent | removeformat | addcomment",image_advtab:false,image_list:tinyImageList,automatic_uploads:true,images_upload_handler:function(e,i,r){var o,t;o=new XMLHttpRequest;o.withCredentials=false;o.open("POST","/api/containers/container1/upload");o.onload=function(){var e;if(o.status!=200){r("HTTP Error: "+o.status);return}e=JSON.parse(o.responseText);var t=e.result.files.file[0];var n=`/api/containers/${t.container}/download/${t.name}`;if(!n){r("Invalid JSON: "+o.responseText);return}i(n)};t=new FormData;t.append("file",e.blob(),e.filename());o.send(t)}})}function setupJsonEditor(){var e=document.getElementById("jsoneditor");if(!e)return;var t={mode:"text",modes:["code","form","text","tree","view"],onError:function(e){alert(e.toString())},onModeChange:function(e,t){console.log("Mode switched from",t,"to",e)}};jsonEditor=new JSONEditor(e,t)}function setupJsonEditorContentTypeRaw(){var e=document.getElementById("jsoneditorRaw");if(!e)return;var t={mode:"text",modes:["code","form","text","tree","view"],onError:function(e){alert(e.toString())},onModeChange:function(e,t){console.log("Mode switched from",t,"to",e)}};jsonEditorRaw=new JSONEditor(e,t);if(this.contentType){initialJson=this.contentType}else if(formValuesToLoad){initialJson=formValuesToLoad}jsonEditorRaw.set(initialJson);const n=jsonEditorRaw.get()}function loadJsonEditor(){var e=currentSectionRecord;jsonEditor.set(e);var t=jsonEditor.get()}function setupJsonRawSave(){$("#saveRawJson").on("click",function(){let e=jsonEditorRaw.get();console.log("json save");let t=$("#contentId").val();let n=e;let i=true;if(e.contentType!=="user"){n={data:e};n.data.id=t}submitContent(n,i,n.contentType)})}async function getImageList(){let e=await dataService.getFiles();tinyImageList=[];e.data.forEach(e=>{let t={title:e.name,filePath:`/api/containers/${e.container}/download/${e.name}`};tinyImageList.push(t)})}async function saveWYSIWYG(){let e=$(".block-edit").data("id");console.log("saving "+e);let t=$("textarea.wysiwyg-content").html();let n=await dataService.getContentById(e);n.data.body=t;editInstance(n);$(".block-edit").children().first().html(t);$(".block-button").show().appendTo($(".block-edit"));fullPageUpdate()}async function addModule(e,t){showSidePanel();let n=await formService.getForm(e,undefined,"addModuleToColumn(submission, true)",true,undefined,t);$(".pb-side-panel #main").html(n);loadModuleSettingForm()}async function editModule(e){showSidePanel();console.log("editing module: "+currentModuleId,currentModuleContentType);let t=await dataService.getContentById(currentModuleId);let n=await formService.getForm(currentModuleContentType,t,"await editInstance(submission, true);",true,undefined,e);$("#dynamicModelTitle").text(`Settings: ${currentModuleContentType} (Id:${currentModuleId})`);$(".pb-side-panel #main").html(n);loadModuleSettingForm()}async function deleteModule(){showSidePanel();let e=await dataService.getContentById(currentModuleId);$("#dynamicModelTitle").text(`Delete: ${currentModuleContentType} (Id:${currentModuleId}) ?`);let t=`<div class="btn-group">
    <button type="button" onclick="deleteModuleConfirm(true)" class="btn btn-danger">Delete Content and Remove from Column</button>
    <button type="button" class="btn btn-danger dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      <span class="sr-only">Toggle Dropdown</span>
    </button>
    <div class="dropdown-menu">
      <a class="dropdown-item" onclick="deleteModuleConfirm(false)" href="#">Remove From Column Only</a>
    </div>
  </div>`;let n=`<div class="delete-data-preview""><textarea>${JSON.stringify(e,null,4)}</textarea></div>`;$(".pb-side-panel #main").html(t+n)}async function deleteModuleConfirm(e=false){console.log("deleteing module: "+currentModuleId,currentModuleContentType);let t=$(`.module[data-id='${currentModuleId}'`);let{isPageUsingTemplate:n,sourcePageTemplateRegion:i,destinationPageTemplateRegion:r}=getPageTemplateRegion(page,currentColumn[0],currentColumn[0]);let o=await getModuleHierarchy(t);let s={data:{}};s.data.sectionId=currentSectionId;s.data.rowIndex=currentRowIndex;s.data.columnIndex=currentColumnIndex-1;s.data.moduleId=currentModuleId;s.data.moduleIndex=currentModuleIndex;s.data.isPageUsingTemplate=n;s.data.pageTemplateRegion=i;s.data.pageId=page.id;s.data.deleteContent=e;return axiosInstance.post("/admin/pb-update-module-delete",s).then(async function(e){console.log(e);fullPageUpdate()}).catch(function(e){console.log(e)})}async function copyModule(){console.log("copying module: "+currentModuleId,currentModuleContentType);let e=$(`.module[data-id='${currentModuleId}'`);let t=await getModuleHierarchy(e);let n={data:{}};n.data.sectionId=currentSectionId;n.data.rowIndex=currentRowIndex;n.data.columnIndex=currentColumnIndex-1;n.data.moduleId=currentModuleId;n.data.moduleIndex=currentModuleIndex;let{isPageUsingTemplate:i,sourcePageTemplateRegion:r,destinationPageTemplateRegion:o}=getPageTemplateRegion(page,currentColumn[0],currentColumn[0]);n.data.isPageUsingTemplate=i;n.data.sourcePageTemplateRegion=r;n.data.destinationPageTemplateRegion=o;n.data.pageId=page.id;return axiosInstance.post("/admin/pb-update-module-copy",n).then(async function(e){console.log(e);fullPageUpdate()}).catch(function(e){console.log(e)})}async function cleanModal(){$("#moduleSettingsFormio").empty()}function getPageTemplateRegion(e,n,i){let t=e.data.pageTemplate&&e.data.pageTemplate!=="none";let r;let o;if(t){let e=$(n.children).filter(function(){return $(this).attr("data-module")=="PAGE-TEMPLATES"})[0];r=$(e).attr("data-id");let t;if(i){t=$(i.children).filter(function(){return $(this).attr("data-module")=="PAGE-TEMPLATES"})[0];o=$(t).attr("data-id")}}return{isPageUsingTemplate:t,sourcePageTemplateRegion:r,destinationPageTemplateRegion:o}}async function addModuleToColumn(e){let t=processContentFields(e.data);let{isPageUsingTemplate:n,sourcePageTemplateRegion:i,destinationPageTemplateRegion:r}=getPageTemplateRegion(page,currentColumn[0],currentColumn[0]);let o;if(e.data.id){o=await editInstance(t)}else{o=await createInstance(t)}let s={id:o.id};let a=e.data.contentType;if(a.indexOf("-settings")>-1){a=a.replace("-settings","")}let l=sharedService.generateShortCode(`${a}`,s);if(n){if(!page.data.pageTemplateRegions){page.data.pageTemplateRegions=[]}if(page.data.pageTemplateRegions){let e=page.data.pageTemplateRegions.filter(e=>e.regionId===r);if(e&&e.length>0){e[0].shortCodes+=l}else{page.data.pageTemplateRegions.push({regionId:r,shortCodes:l})}editInstance(page)}}else{let e=await dataService.getContentById(currentSectionId);let t=e.data.rows[currentRowIndex].columns[currentColumnIndex-1];t.content+=l;editInstance(e)}fullPageUpdate()}async function submitContent(e,t=true,n="content"){console.log("Submission was made!",e);let i=e.data?e.data:e;if(!n.startsWith("user")){if(e.id||e.data.id){await editInstance(i,t,n)}else{await createInstance(i,true,n)}}else{i.contentType=n;let e=await axios({method:"post",url:"/form-submission",data:{data:i}});fullPageUpdate()}}async function postProcessNewContent(n){if(n.contentType=="page"){if(n.includeInMenu){let e=await getContentByContentTypeAndTitle("menu","Main");let t={url:n.url,title:n.name,active:true,level:"0"};e.data.links.push(t);await editInstance(e)}}}function fullPageUpdate(e=undefined){console.log("refreshing page");if(e){window.location.replace(e)}else{location.reload()}}async function redirect(e){console.log("redirecting page");window.location.replace(e);return false}async function writeFile(e,t){let n=new FormData;n.append("file",t);alert("not implemented")}async function setupACEEditor(){if($("#editor").length===0){return}ace.config.set("basePath","/node_modules/ace-builds/src-min-noconflict");var t=ace.edit("editor");t.setTheme("ace/theme/monokai");t.session.setMode("ace/mode/css");t.getSession().on("change",function(){e()});function e(){var e=t.getSession().getValue();$("#templateCss").html(e)}$("#save-global-css").click(async function(){let e=t.getSession().getValue();await dataService.fileUpdate(`/server/themes/front-end/${theme}/css/template.css`,e,sessionID)});beatifyACECss()}async function setupDropZone(){if(!globalService.isBackEnd()){return}Dropzone.autoDiscover=false;var e=$(document.body).dropzone({url:"/dropzone-upload",addRemoveLinks:true,maxFilesize:100,dictDefaultMessage:'<span class="text-center"><span class="font-lg visible-xs-block visible-sm-block visible-lg-block"><span class="font-lg"><i class="fa fa-caret-right text-danger"></i> Drop files <span class="font-xs">to upload</span></span><span>&nbsp&nbsp<h4 class="display-inline"> (Or Click)</h4></span>',dictResponseError:"Error uploading file!",headers:{Authorization:$("#token").val()},addedfile:function(e){console.log("dropzone adding file "+e.name)},complete:function(){console.log("dropzone complete")},accept:async function(e,t){console.log("dropzone accept");t()},queuecomplete:function(){console.log("dropzone queuecomplete");fullPageUpdate()}});async function t(e){let t=e.name.replace(/\.[^/.]+$/,"");let n={data:{title:t,file:e.name,contentType:"media"}};await createInstance(n)}}async function beatifyACECss(){if(typeof ace!=="undefined"){var e=ace.require("ace/ext/beautify");var t=ace.edit("editor");e.beautify(t.session)}}async function setupSortable(){let e=$('main .pb div[class^="col"]');var t=jQuery.makeArray(e);t.forEach(e=>{setupSortableColum(e)})}async function setupSortableColum(e){if(typeof Sortable!=="undefined"){var t=new Sortable(e,{group:"shared",draggable:".module",onEnd:function(e){var t=e.item;e.to;e.from;e.oldIndex;e.newIndex;e.oldDraggableIndex;e.newDraggableIndex;e.clone;e.pullMode;updateModuleSort(t,e)}})}}async function getModuleHierarchy(e){let t=$(e)[0].closest("section");let n=t.dataset.id;let i=$(e)[0].closest(".row");let r=$(i).index();let o=$(e)[0].closest('div[class^="col"]');let s=$(o).index();return{sourceSectionHtml:t,sourceSectionId:n,sourceRow:i,sourceRowIndex:r,sourceColumn:o,sourceColumnIndex:s}}async function updateModuleSort(c,e){let t=e.item.dataset.id;let n=$(e.from)[0].closest('div[class^="col"]');let i=$(e.to)[0].closest('div[class^="col"]');let{isPageUsingTemplate:r,sourcePageTemplateRegion:o,destinationPageTemplateRegion:s}=getPageTemplateRegion(page,n,i);let a=await getModuleHierarchy(e.from);let d=$(e.to)[0].closest("section");let h=d.dataset.id;let f=$(e.to)[0].closest(".row");let p=$(f).index();let m=$(i).index();let l;let g=r?"[data-template-region='true']":".module";l=$(i).find(g).toArray().map(function(e){let t={id:e.dataset.id,module:e.dataset.module};return t});let u={data:{}};u.data.pageId=page.id;u.data.sourceSectionId=a.sourceSectionId;u.data.sourceRowIndex=a.sourceRowIndex;u.data.sourceColumnIndex=a.sourceColumnIndex;u.data.sourceModuleIndex=e.oldIndex;u.data.destinationSectionId=h;u.data.destinationRowIndex=p;u.data.destinationColumnIndex=m;u.data.destinationModuleIndex=e.newIndex;u.data.destinationModules=l;u.data.isPageUsingTemplate=r;u.data.sourcePageTemplateRegion=o;u.data.destinationPageTemplateRegion=s;u.data.moduleBeingMovedId=t;return axiosInstance.post("/admin/pb-update-module-sort",u).then(async function(e){console.log(e);fullPageUpdate();return await e.data}).catch(function(e){console.log(e)})}function setupSidePanel(){$(".pb-side-panel .handle span").click(function(){$(".pb-side-panel").addClass("close");$(".pb-side-panel-modal-backdrop").addClass("close")})}function showSidePanel(){$(".pb-side-panel-modal-backdrop").removeClass("close");$(".pb-side-panel").removeClass("close")}function setupAdminMenuMinimizer(){if(globalService.isBackEnd()){return}$(".pb-wrapper .sidebar-minimizer").click(function(){Cookies.set("showSidebar",false);toggleSidebar(false)});$(".sidebar-expander").click(function(){Cookies.set("showSidebar",true);toggleSidebar(true)});if(isEditMode()==="true"){toggleSidebar(true)}else{toggleSidebar(false)}}function toggleSidebar(e){if(e){$(".pb-wrapper").css("left","0");$("main, .fixed-top, footer").css("margin-left","260px");$(".sidebar-expander").css("left","-60px");setupUIClicks()}else{$(".pb-wrapper").css("left","-260px");$("main, .fixed-top, footer").css("margin-left","0");$(".sidebar-expander").css("left","0");disableUIHoversAndClicks()}}function isEditMode(){let e=Cookies.get("showSidebar");return e}async function addUser(){console.log("adding section");let e=await generateNewRow();let t=[e];let n=1;if(page.data.layout){n=page.data.layout.length+1}let i={title:`Section ${n}`,contentType:"section",rows:t};let r=await createInstance(i);if(!page.data.layout){page.data.layout=[]}page.data.layout.push(r.id);let o=await editInstance(page);fullPageUpdate()}async function setupAdminMediaFormImage(){if(window.location.href.indexOf("admin/content/edit/media/")>0){let t=$('input[name="data[file]"]').val();if(t){if($("#fileStorage").val()=="AMAZON_S3"){let e=$("#fileStorageBase").val();$(".admin-form-media-image").attr("src",`${e}/${t}`)}else{$(".admin-form-media-image").attr("src",`/assets/uploads/${t}`)}}}}$(document).ready(async function(){setupACEForSnippets()});async function setupACEForSnippets(){if(typeof ace==="undefined"){return}let r=$(".code-snippet");for(let i=0;i<r.length;i++){let e=r[i];let t=$(e);let n=t.data("type");var o=ace.edit(e);o.setTheme("ace/theme/chrome");o.session.setMode("ace/mode/"+n);o.renderer.setShowGutter(false);o.setOptions({maxLines:40,readOnly:true,highlightActiveLine:false,highlightGutterLine:false});o.renderer.$cursorLayer.element.style.display="none";o.autoIndent=true;o.setShowPrintMargin(false)}}var initPhotoSwipeFromDOM=function(e){var u=function(e){var t=e.childNodes,n=t.length,i=[],r,o,s,a;for(var l=0;l<n;l++){r=t[l];if(r.nodeType!==1){continue}o=r.children[0];s=o.getAttribute("data-size").split("x");a={src:o.getAttribute("href"),w:parseInt(s[0],10),h:parseInt(s[1],10)};if(r.children.length>1){a.title=r.children[1].innerHTML}if(o.children.length>0){a.msrc=o.children[0].getAttribute("src")}a.el=r;i.push(a)}return i};var c=function e(t,n){return t&&(n(t)?t:e(t.parentNode,n))};var t=function(e){e=e||window.event;e.preventDefault?e.preventDefault():e.returnValue=false;var t=e.target||e.srcElement;var n=c(t,function(e){return e.tagName&&e.tagName.toUpperCase()==="FIGURE"});if(!n){return}var i=n.parentNode,r=n.parentNode.childNodes,o=r.length,s=0,a;for(var l=0;l<o;l++){if(r[l].nodeType!==1){continue}if(r[l]===n){a=s;break}s++}if(a>=0){d(a,i)}return false};var n=function(){var e=window.location.hash.substring(1),t={};if(e.length<5){return t}var n=e.split("&");for(var i=0;i<n.length;i++){if(!n[i]){continue}var r=n[i].split("=");if(r.length<2){continue}t[r[0]]=r[1]}if(t.gid){t.gid=parseInt(t.gid,10)}return t};var d=function(e,t,n,i){var r=document.querySelectorAll(".pswp")[0],o,s,a;a=u(t);s={galleryUID:t.getAttribute("data-pswp-uid"),getThumbBoundsFn:function(e){var t=a[e].el.getElementsByTagName("img")[0],n=window.pageYOffset||document.documentElement.scrollTop,i=t.getBoundingClientRect();return{x:i.left,y:i.top+n,w:i.width}}};if(i){if(s.galleryPIDs){for(var l=0;l<a.length;l++){if(a[l].pid==e){s.index=l;break}}}else{s.index=parseInt(e,10)-1}}else{s.index=parseInt(e,10)}if(isNaN(s.index)){return}if(n){s.showAnimationDuration=0}o=new PhotoSwipe(r,PhotoSwipeUI_Default,a,s);o.init()};var i=document.querySelectorAll(e);for(var r=0,o=i.length;r<o;r++){i[r].setAttribute("data-pswp-uid",r+1);i[r].onclick=t}var s=n();if(s.pid&&s.gid){d(s.pid,i[s.gid-1],true,true)}};initPhotoSwipeFromDOM(".home-gallery");window.onscroll=function(){scrollCheck()};var navbar=document.getElementById("accordian-menu");if(navbar){var sticky=navbar.getBoundingClientRect().top-90}function scrollCheck(){if(navbar){if(window.pageYOffset>=sticky){navbar.classList.add("sticky")}else{navbar.classList.remove("sticky")}}}