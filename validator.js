// Đối tượng `Validator`
function Validator(options) {
    var selectorRules = {};
     
    // Hàm thực hiện validate
    function Validate(inputElement, rule) {
          // Từ thẻ input trỏ lên thẻ cha và chọc vào thẻ span
           var errorElement = inputElement.parentElement.querySelector(options.errorSelector)

             // value người dùng nhập: inputElement.value
            // test function: rule.test
          var errorMessage;

            // Lấy các rules của selector
          var rules = selectorRules[rule.selector];

            // Lặp qua các rules & check
            // Nếu có lỗi thì dừng check
          for(var i = 0; i < rules.length; i++) {
              errorMessage = rules[i](inputElement.value);
              if (errorMessage) break;
          }

                if (errorMessage) {
                  errorElement.innerText = errorMessage;
                  inputElement.parentElement.classList.add('invalid');
                } else {
                  errorElement.innerText = '';
                  inputElement.parentElement.classList.remove('invalid');
                }
             }

    // Get ra form tổng thể
    var formElement = document.querySelector(options.form);
    
    if (formElement) {
        // khi submit form (nhấn Đăng ký)
        formElement.onsubmit = function(e) {
            e.preventDefault();

            // Lặp qua rule & validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                Validate(inputElement,rule);
            });
        }


    // Duyệt qua từng phần tử trong form
    options.rules.forEach(function (rule) {

            // Lưu lại các Rule cho mỗi input
                if(Array.isArray(selectorRules[rule.selector])) {
                    selectorRules[rule.selector].push(rule.test)
                } else {
                    selectorRules[rule.selector] = [rule.test];
                }


            // Get ra các ptu bên trong form tổng thể (rule)
           var inputElement = formElement.querySelector(rule.selector);
          if (inputElement) {
            //   Xử lý trường hợp blur khỏi input
              inputElement.onblur = function () {
                Validate(inputElement,rule);
              }

            //   xử lý mỗi khi người dùng nhập vào input
            inputElement.oninput = function () {
                var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                errorElement.innerText = '';
                inputElement.parentElement.classList.remove('invalid');
            }
          }
    });
    console.log(selectorRules)
       
    }
}


// Đinh nghĩa các Rules
// Nguyên tắc của các Rules
// 1. Khi có lỗi => trả về message lỗi
// 2. Khi hợp lệ (có value ng dùng nhập) => trẻ về undefined

Validator.isRequired = function(selector, message) {



    return {
        selector:selector,
        test: function (value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này !'
        }
    };
}

Validator.isEmail = function(selector, message) {
     return {
        selector:selector,
        test: function (value) {
            // check Email
            var regex =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;   
            return regex.test(value) ? undefined : message || 'Trường này phải là Email'
        }
    };;
}

Validator.minLength = function(selector, min, message) {
    return {
       selector:selector,
       test: function (value) {
           return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} ký tự`
       }
   };;
}

Validator.isConfirm = function (selector, getConfirm, message) {
    return {
        selector:selector,
        test: function (value) {
            return value === getConfirm() ? undefined : message || 'Giá trị không hợp lệ'
        }
    }
}