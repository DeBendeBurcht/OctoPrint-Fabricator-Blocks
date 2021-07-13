/*,
 * View model for BLOCKSUI
 *
 * Author: Hugo C. Lopes Santos Costa
 * License: AGPLv3
 */

$('head').prepend('<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">');
$(function() {
    function BlocksViewModel(parameters) {
        var self = this;


        //Run in debug/verbose mode
        self.debug = false;

        // assign the injected parameters, e.g.:
        // self.loginStateViewModel = parameters[0];
        self.settings = parameters[0];
        self.connection = parameters[0];
        // TODO: Implement your plugin's view model here.

        //max column width
        self.maxCWidth = 12;
        // Quick debug
        self.logToConsole = function(msg){
            if (!self.debug){
                return true;
            }
            if (typeof console.log == "function"){
                console.log('BLOCKS:',msg)
            }
        }
        //~~----------------------------------------------------
        self.onAllBound = function(){
          //~~ Set names

          //Html can have mulitple classes so
          $('#tabs').parent().addClass('BLOCKSMainTabs');

          //Adds a class name for the class="container octoprint-container BLOCKSUICol1"
          //On the side bar i add another class name

          $('#sidebar').addClass('BLOCKSUICol1');

          //adds another class name for the octoprint-container i can now calle it BLOCKSUIMainContainer
          $('div.octoprint-container').addClass('BLOCKSMainContainer');


          // Load custom layout
          self.UpdateLayout(self.settings.settings.plugins.BLOCKS);

          // Refresh all
          window.setTimeout(function() {
              $(window).trigger('resize');
          },500);

        }
        //                    onAllBound END


        // --------------------------------------------------
        self.UpdateLayout= function(settingsPlugin){

          self.logToConsole('Updating layout');

          $('#sidebar').removeClass('span4');


          self.set_fixedHeader(settingsPlugin.fixedHeader());

          self.set_fluidLayout(settingsPlugin.fluidLayout());

          self.set_hideGraphBackground(settingsPlugin.hideGraphBackground());
          //Builds the main layout
          self.set_mainLayout(settingsPlugin);

        }


        //---------------------------------------------------
        self.set_fixedHeader = function(enable){
          if(enable){
            $('body').addClass('BLOCKSUIfixedHeader');
            $('#navbar').removeClass('navbar-static-top').addClass('navbar-fixed-top');
            $('#navbar').css('overflow','visible');
          }else{
            $('body').removeClass('BLOCKSUIfixedHeader');
            $('#navbar').addClass('navbar-static-top').removeClass('navbar-fixed-top');
            $('#navbar').css('overflow','');
          }
        }

        //--------------------------------------------------
        self.set_hideGraphBackground = function(enable){
          if(enable){
            $('#temperature-graph').addClass('BLOCKSnoBackground');
          }else{
            $('#temperature-graph').removeClass('BLOCKSUInoBackground');
          }
        }

        //-------------------------------------------------
        // In this function where i can change the layout of the main container
        self.set_mainLayout = function(settingsPlugin){
          //What i want to do here is just create a matrix 3x3
          $('div.BLOCKSMainContainer > div.row').removeClass('row').addClass('row-fluid').addClass('TopRow');

          //add another row after the TopRow
          $('<div class= "row-fluid BotRow" ></div>').insertBefore('div.footer');

          //add an id to both rows
          $('div.BLOCKSMainContainer > div.row-fluid.TopRow').attr('id','BLOCKSRowTop');
          $('div.BLOCKSMainContainer > div.row-fluid.BotRow').attr('id','BLOCKSRowBot');


          //Now i need to build all the collumns I NEED already with an ID
          $('#BLOCKSRowTop').append('<div class="col span4 BLOCKCol1" id="BTC1"></div>');
          $('#BLOCKSRowTop').append('<div class="col span4 BLOCKCol2" id="BTC2"></div>');
          $('#BLOCKSRowTop').append('<div class="col span4 BLOCKCol3" id="BTC3"></div>');
          $('#BLOCKSRowBot').append('<div class="col span4 BLOCKCol1" id="BBC1"></div>');
          $('#BLOCKSRowBot').append('<div class="col span4 BLOCKCol2" id="BBC2"></div>');
          $('#BLOCKSRowBot').append('<div class="col span4 BLOCKCol3" id="BBC3"></div>');


          //In these set of instructions i set what each container on my grid has
          $('#sidebar_plugin_action_command_notification_wrapper').appendTo($('#BTC1'));
          $('#state_wrapper').appendTo($('#BTC2'));
          // ~~The function where i create the Controls wrapper.
          self.set_ControlWrapper(settingsPlugin);
          $('#connection_wrapper').appendTo($('#BBC1'));
          $('div.tabbable.span8').appendTo($('#BBC2'));
          $('#sidebar_plugin_firmware_check_info_wrapper').appendTo($('#BBC1'));
          $('#sidebar_plugin_firmware_check_warning_wrapper').appendTo($('#BBC1'));
          $('#files_wrapper').appendTo($('#BBC3'));

          // I don't need the sidebar anymore
          $('#sidebar').remove();

          $('div.tabbable').removeClass('span8');

          // The tabs does not need the Control tab because the Control module is
          // on my grid
          $('div.tabbable > ul.nav.nav-tabs > #control_link').remove();

          // Neither do i need the old tabbable
          $('.TopRow > div.BLOCKSMainTabs').remove();

        }


        //------------------------------------------------------------
        // Fix fluid layout
        self.set_fluidLayout = function(enabled){
            if (enabled){
                $('#navbar > div.navbar-inner > div:first').removeClass("container").addClass("container-fluid").removeAttr("style","");
                $('div.BLOCKSMainContainer').removeClass("container").addClass("container-fluid");

            }else{
                $('#navbar > div.navbar-inner > div:first').removeClass("container-fluid").addClass("container");
                $('div.BLOCKSMainContainer').removeClass("container-fluid").addClass("container");

            }
        }
        // ------------------------------------------------------------------------------------------------------------------------

        self.set_ControlWrapper = function(settingsPlugin){

          // Wrap my #control ( Made by OctoPrint ) on a new division with the ID="control_wrapper"
          $('#control').wrap('<div id="control_wrapper" class="accordion-group" data-bind="visible: loginState.hasAnyPermissionKo(access.permissions.CONTROL)"></div>');

          // Remove the tab-pane class because it's no longer a tab pane, it's a separate wrapper now
          $('#control').removeClass('tab-pane').addClass('accordion-body');

          // This is for the heading, also gives it  the possibility to collapse.
          $('<a class="accordion-toggle" data-toggle="collapse" data-target="#control"></a>').insertBefore('#control');

          // I needed a inner wrapper so i used the query function wrapInner to wrap everything inside the #control
          $('#control').wrapInner('<div class="accordion-inner"></div>');

          // Needed to wrap my header
          $('#control_wrapper > a').wrap('<div class="accordion-heading"></div>');

          // Adds the gamepad icon in black and also adds the text "Controls" to the header
          $('#control_wrapper > div.accordion-heading > a').append('<i class=" fas icon-black fa-gamepad"></i>');
          $('#control_wrapper > div.accordion-heading > a').append(' Controls ');

          // Finally i place my new control wrapper in my grid
          $('#control_wrapper').appendTo($('#BTC3'));

        }







      }


    /* view model class, parameters for constructor, container to bind to
     * Please see http://docs.octoprint.org/en/master/plugins/viewmodels.html#registering-custom-viewmodels for more details
     * and a full list of the available options.
     */
    OCTOPRINT_VIEWMODELS.push({
        construct: BlocksViewModel,
        // ViewModels your plugin depends on, e.g. loginStateViewModel, settingsViewModel, ...
        dependencies: ["settingsViewModel","connectionViewModel"],
        // Elements to bind to, e.g. #settings_plugin_BLOCKS, #tab_plugin_BLOCKS, ...
        elements: []
    });
});
