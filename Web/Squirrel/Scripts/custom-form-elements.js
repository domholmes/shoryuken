
var checkboxHeight = "29";

document.write('<style type="text/css">input.styled { display: none; } .disabled { opacity: 0.5; filter: alpha(opacity=50); }</style>');

var Custom = {
    init: function () {
        var inputs = document.getElementsByTagName("input"), span = Array(), textnode, option, active;
        for (a = 0; a < inputs.length; a++) {
            if ((inputs[a].type == "checkbox") && inputs[a].className == "styled") {
                span[a] = document.createElement("span");
                span[a].className = inputs[a].type;

                if (inputs[a].checked == true) {
                    position = "0 -" + (checkboxHeight * 1) + "px";
                    span[a].style.backgroundPosition = position;
                }
                inputs[a].parentNode.insertBefore(span[a], inputs[a]);

                if (!inputs[a].getAttribute("disabled")) {
                    span[a].onmousedown = Custom.check;
                } else {
                    span[a].className = span[a].className += " disabled";
                }
            }
        }
    },
    check: function () {
        element = $(this).next()[0];
        if (element.type == "checkbox") {
            if (element.checked == true) {
                this.style.backgroundPosition = "0 0";
                $(element).attr('checked', false).triggerHandler('click')
            }
            else {
                this.style.backgroundPosition = "0 -" + checkboxHeight * 1 + "px";
                $(element).attr('checked', true).triggerHandler('click')
            }
        }
    }
}
window.onload = Custom.init;