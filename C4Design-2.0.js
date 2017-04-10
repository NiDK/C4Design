/*!
 * C4Design Library v2.0
 * 
 * Author: dakun.ni@cn.pwc.com 
 *
 * Date: 2017-04-06
 */
(function($) {
	var C4Design = {};
	$.fn.C4Design = C4Design;

	C4Design.Filed = function(field) {

		filedItem.value = function(option) {
			if (option) {
				return setValue(field, option);
			} else {
				return getValue(field);
			}
		};

		filedItem.validation = function(option) {
			return setValidation(field, null, option);
		};

		filedItem.empty = function() {
			return setEmpty(field);
		}

		filedItem.type = function() {
			return getControlType(field);
		}

		filedItem.attributes = function(attributesKey,attributesValue) {
			if(attributesValue!=undefined){
				$(getElement(field)).attr(attributesKey,attributesValue);
			}else{
				return $(getElement(field)).attr(attributesKey);
			}
			
		}

		filedItem.class = function(className) {
			if(className!=undefined&& className!=""){
				$(getElement(field)).addClass(className);
			}
		}

		filedItem.inputRegular = function(reg) {
			if(reg!=undefined&& reg!=""){
				$(getElement(field)).attr("regular",reg);
			}
		}

		filedItem.invalidMessage = function(msg) {
			if(msg!=undefined&& msg!=""){
				$(getElement(field)).attr("invalid-msg",msg);
			}
		}

		filedItem.displayValueInTitle = function() {
			var itemValue= getValue(field);
			if(itemValue!=undefined&& itemValue!=""){
				$("title").html(itemValue+"_"+$("title").html());
			}
		}

		return filedItem
	};

	C4Design.Section = function(field) {
		console.log("C4Design");
	};

	C4Design.Html = function(field) {
		console.log("C4Design");
	};

	C4Design.Document = function() {
		document.status = getState();

		document.setShowHideMultipl = function(option) {
			setShowHideMultipl(option);
		}

		return document;
	};


	function setShowHideMultipl(option) {
		$(option).each(function(i, items) {
			setShowHide(getValue(items.item), items.showSection, items.innerItem, false);

			if (PageMode != "preview") {
				getElement(items.item).change(function() {
					setShowHide($(this).val(), items.showSection, items.innerItem, true);
				});
			}

			if (items.hasOwnProperty("innerItem"))
				$(items.innerItem).each(function(inx, innerItem) {
					if (innerItem.hasOwnProperty("item")) {
						setShowHideMultipl(innerItem);
					}
				})
		})

	}

	function setShowHide(itemValue, showSection, innerItem, isChange) {

		$(showSection).each(function(i, item) {
			if (itemValue == item.ifValue || itemValue.indexOf(item.ifValue) >= 0) {
				getSection(item.field, item.finder).show();
				setValidation(item.field, item.finder);
			} else {

				getSection(item.field, item.finder).hide();
				setEmpty(item.field, item.finder);
				setValidation(item.field, item.finder, false);
			}

		})

		if (innerItem != undefined) {

			var inner = innerItem;
			var ifFirst = true;
			var changItemVale;

			while (inner != undefined) {

				$(inner).each(function(innerIndex, innerItems) {

					if (ifFirst) {
						if (isChange) {
							getSection(innerItems.item, innerItems.finder).hide();
							setEmpty(innerItems.item, innerItems.finder);
							setValidation(innerItems.item, innerItems.finder, false);
						}
						changItemVale = getValue(innerItems.item);
					}

					$(innerItems.showSection).each(function(i, item) {


						if (changItemVale == item.ifValue || changItemVale.indexOf(item.ifValue) >= 0) {
							if (ifFirst) {
								getSection(item.field, item.finder).show();
								setValidation(item.field, item.finder);
							}
						} else {

							getSection(item.field, item.finder).hide();
							setEmpty(item.field, item.finder);
							setValidation(item.field, item.finder, false);
						}

					})

					if (itemValue == innerItems.ifValue || itemValue.indexOf(innerItems.ifValue) >= 0) {
						if (ifFirst) {
							getSection(innerItems.item, innerItems.finder).show();
							setValidation(innerItems.item, innerItems.finder);
						}
					} else {
						getSection(innerItems.item, innerItems.finder).hide();
						setEmpty(innerItems.item, innerItems.finder);
						setValidation(innerItems.item, innerItems.finder, false);
					}
					changItemVale = getValue(innerItems.item);

				});
				ifFirst = false;
				inner = inner[0].innerItem;

			}

		}

	}

	// if isRequired is undefined 恢复默认 Validation.
	function setValidation(itemValue, finder, isRequired) {
		if (PageMode == "edit" || PageMode == "add") {
			if (isRequired == undefined) {
				$(getSection(itemValue, finder)).find("[req]:not([requirexd='required'])").attr("required", "required").addClass("validatebox-invalid");
			} else if (isRequired) {
				if ($(getSection(itemValue, finder)).find("[name][requirexd='required']").length < 1) {
					$(getSection(itemValue, finder)).find("[name]:not([requirexd='required'])").attr("required", "required").addClass("validatebox-invalid");
				}

			} else {
				$(getSection(itemValue, finder)).find("[required]").removeAttr("required").removeClass("validatebox-invalid").attr("req", "required");
			}
		} else
			return undefined;
	}

	function getState(itemValue) {
		var status;
		if (itemValue == undefined || itemValue == "") {
			status = getValue(itemValue);
		} else {
			status = getValue("C4-WorkflowStateDisplayName");
		}
		if (PageMode == "add" && (status == undefined || status == "")) {
			return "new";
		} else {
			return status;
		}
	}

	function setEmpty(valueName, finder) {
		if (PageMode == "edit" || PageMode == "add") {
			if (finder == undefined || finder == "") {

				setEmptyFiled(valueName);
			} else {
				$(getSection(valueName, finder)).find("[name]").each(function(i, item) {

					setEmptyFiled($(item).attr("name"));
				})
			}
		} else {
			return undefined;
		}
	}

	function setEmptyFiled(valueName) {
		switch (getControlType(valueName)) {
			case "radio":
			case "checkbox":
				$(getSection(valueName)).find(":checked").removeAttr("checked");
				// 确保空值被提交.
				if (radiolist != undefined && radiolist.indexOf(valueName) < 0) radiolist.push(valueName);
				break;
			case "text":
			case "hidden":
			case "textarea":
				$(getElement(valueName)).val("");
				break;
			case "PeoplePicker":
				$(getElement(valueName)).parent().find('span').remove();
				$(getElement(valueName)).val("");
				$(getElement(valueName)).prev().val("");
				break;
			case "Richtext":
				CKEDITOR.instances["Metadata-" + valueName].setData("");
				break;
			case "MultiSelect":
			case "SingleSelect":
				$(getElement(valueName)).selectpicker('val', []);
				// 确保空值被提交.
				if (radiolist != undefined && radiolist.indexOf(valueName) < 0) radiolist.push(valueName);
				break;
			default:
				return undefined;
		}
		return true;
	}

	function getElement(valueName) {
		if (PageMode == "edit" || PageMode == "add") {
			return $("[name='" + valueName + "']");
		} else {
			return undefined;
		}
	}

	function getSection(valueName, finder) {
		switch (finder) {
			case "parent":
				return $("[name='DIV_" + valueName + "']").parent().parent().parent().parent().parent();
			case "prev":
				if ($("[name='DIV_" + valueName + "']").prev().prev().length <= 0) {
					return $("[name='DIV_" + valueName + "']").parent().prev();
				} else {
					return $("[name='DIV_" + valueName + "']").prev().prev();
				}

			case "next":
				if ($("[name='DIV_" + valueName + "']").next().next().length <= 0) {
					return $("[name='DIV_" + valueName + "']").parent().next();
				} else {
					return $("[name='DIV_" + valueName + "']").next().next();
				}

			default:
				return $("[name='DIV_" + valueName + "']");
		}
	}


	function getPeoplePickDetails(valueName) {
		return JSON.parse($("#Metadata-" + valueName + "_relationsvalue").attr("value"));
	}


	// **
	// radio
	// checkbox
	// text
	// hidden
	// PeoplePicker
	// textarea
	// Richtext
	// MultiSelect
	// SingleSelect
	// div
	// **
	function getControlType(valueName) {
		if (valueName == undefined) return undefined;
		var controlType = "";
		if (PageMode == "edit" || PageMode == "add") {
			var item;
			var nodeName;

			if (typeof(valueName) == "string") {
				item = $("[name='" + valueName + "']");
				nodeName = document.getElementsByName(valueName)[0] ? document.getElementsByName(valueName)[0].tagName.toLowerCase() : "";

			} else {
				item = $(valueName);
				nodeName = item[0] ? item[0].tagName.toLowerCase() : "";

			}
			switch (nodeName) {
				case "input":
					var nodeType = $(item).attr("type");
					switch (nodeType) {
						case "radio":
						case "checkbox":
						case "text":
							controlType = nodeType;
							break;
						case "hidden":

							if ($(item).parent(".x_dpBoxWrapper").length > 0) {
								controlType = "PeoplePicker"
							} else {
								controlType = nodeType;
							}
							break;
						default:
							if ($(item).parent(".x_dpBoxWrapper").length > 0) {
								controlType = "PeoplePicker"
							} else {
								controlType = nodeType;
							}
							break;
					}
					break;
				case "textarea":
					if ($(item).next().find("iframe").length > 0) {
						controlType = "Richtext";

					} else {
						controlType = nodeName;

					}
					break;
				case "select":
					if ($(item).attr("multiple") == "multiple") {
						controlType = "MultiSelect";
					} else {
						controlType = "SingleSelect";
					};
					break;
				case "div":
					controlType = "div";
					break;
				default:
					return undefined;

			}
			return controlType;
		} else {
			return undefined;
		}
	}

	function setValue(valueName, value) {
		if (valueName == undefined) {
			return "";
		}
		switch (PageMode) {
			case "preview":
				var valueItem = $("[name='DIV_" + valueName + "'] div div");

				if (valueItem.length == 1) {
					if ($(valueItem).find("label").length > 0) {
						return $(valueItem).find("label").eq(0).html(value);
					} else {
						return $(valueItem).eq(0).html(value);
					}
				} else {
					return "";
				}

			case "edit":
			case "add":
				setEmptyFiled(valueName);

				switch (getControlType(valueName)) {

					case "radio":
						$(getElement(valueName)).find("[value='" + value + "']").attr("checked", "checked");
						return;
					case "checkbox":
						if (typeof(value) == "string") {
							$(getElement(valueName)).find("[value='" + value + "']").attr("checked", "checked");
						} else if (typeof(value) == "object") {
							$(value).each(function(item, i) {
								$(getElement(valueName)).find("[value='" + item + "']").attr("checked", "checked");
							})
						} else {
							return;
						}
						return;

					case "text":
					case "hidden":
					case "textarea":
						return $(getElement(valueName)).val(value);

					case "PeoplePicker":
						if (_array) {
							if (typeof(value) == "string") {
								_array[0].item.setValue("value");

							} else if (typeof(value) == "object") {
								_array.forEach(fucntion(arrayItem, arrayI) {
									if (arrayItem.key == valueName) {
										value.forEach(function(item, i) {
											arrayItem.item.setValue(item);
										})
									}
								})

							} else {
								return;
							}
						}
						return;
					case "Richtext":
						return CKEDITOR.instances["Metadata-" + valueName].setData(value);
					case "SingleSelect":
					case "MultiSelect":

						return $(getElement(valueName)).selectpicker('val', value);

					default:
						//lable
						return undefined;
				}

			default:
				return "";
		}
	}

	function getValue(valueName) {
		if (valueName == undefined) {
			return "";
		}
		switch (PageMode) {
			case "preview":
				var valueItem = $("[name='DIV_" + valueName + "'] div div");

				if (valueItem.length == 1) {
					if ($(valueItem).find("label").length > 0) {
						return $(valueItem).find("label").eq(0).html().trim();
					} else {
						return $(valueItem).eq(0).html().trim();
					}
				} else {
					return "";
				}
			case "edit":
			case "add":

				switch (getControlType(valueName)) {

					case "radio":
						var itemValue = $(getSection(valueName)).find(":checked").val()
						return itemValue ? itemValue : "";

					case "checkbox":
						var values = ""
						var items = $(getSection(valueName)).find(":checked");
						if (items.length > 0) {
							$(getSection(valueName)).find(":checked").each(function(item, i) {
								if (i == 0) {
									values = $(item).val();
								} else {
									values = values + "," + $(item).val();
								}

							});
						} else {
							values = "";
						}
						return values;

					case "text":
					case "hidden":
					case "textarea":
					case "SingleSelect":
					case "PeoplePicker":
						return $(getElement(valueName)).val();

					case "Richtext":
						return CKEDITOR.instances["Metadata-" + valueName].getData();

					case "MultiSelect":
						var item = $(getElement(valueName)).val();
						if (item != undefined && item.length > 0)
							return $(getElement(valueName)).val().join(",");
						else return "";

					default:
						//lable
						if ($("[name='DIV_" + valueName + "']").length > 0) {
							return $("[name='DIV_" + valueName + "'] div").eq(1).html().trim();
						} else {
							return undefined;
						}

				}

			default:
				return "";
		}
	};

	function ForDight(Dight, How) {
		var Dight = Math.round(Dight * Math.pow(10, How)) / Math.pow(10, How);
		return Dight;
	}
})(jQuery);
var C4Design = $(this).C4Design;