/**
 * Created by ivaykin on 2/14/16.
 */



var msg = new SpeechSynthesisUtterance();
var voices = window.speechSynthesis.getVoices();
msg.voice = voices[10]; // Note: some voices don't support altering params
msg.voiceURI = 'native';
msg.volume = 1; // 0 to 1
msg.rate = 1; // 0.1 to 10
msg.pitch = 0.8; //0 to 2
msg.lang = 'ru-RU';


/*msg.onend = function(e) {
 console.log('Speak finished in ' + event.elapsedTime + ' seconds.');
 };*/

function speak(message, callback) {
    msg.text = message;
    msg.onend = callback;
    speechSynthesis.speak(msg);
}

var final_transcript = '';

function hear(callback) {
    if (!('webkitSpeechRecognition' in window)) {
        upgrade();
    } else {

        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onstart = function() {
            recognizing = true;
            showInfo('info_speak_now');
            start_img.src = 'mic-animate.gif';
        };
        recognition.onerror = function(event) {
            if (event.error == 'no-speech') {
                start_img.src = 'mic.gif';
                showInfo('info_no_speech');
                ignore_onend = true;
            }
            if (event.error == 'audio-capture') {
                start_img.src = 'mic.gif';
                showInfo('info_no_microphone');
                ignore_onend = true;
            }
            if (event.error == 'not-allowed') {
                if (event.timeStamp - start_timestamp < 100) {
                    showInfo('info_blocked');
                } else {
                    showInfo('info_denied');
                }
                ignore_onend = true;
            }
        };
        recognition.onend = function() {
            recognizing = false;
            if (ignore_onend) {
                return;
            }
            start_img.src = 'mic.gif';
            if (!final_transcript) {
                showInfo('info_start');
                return;
            }
            showInfo('');
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
                var range = document.createRange();
                range.selectNode(document.getElementById('final_span'));
                window.getSelection().addRange(range);
            }
            if (create_email) {
                create_email = false;
                createEmail();
            }
        };
        recognition.onresult = function(event) {
            var interim_transcript = '';

            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;

                    final_transcript = capitalize(final_transcript);
                    final_span.innerHTML = linebreak(final_transcript);
                    interim_span.innerHTML = linebreak(interim_transcript);
                    if (event.results.length > 0) {
                        var transcript = final_transcript;//event.results[0][0].transcript;
                        callback(transcript);
                    }

                } else {
                    interim_transcript += event.results[i][0].transcript;
                    callback(transcript);
                }
            }
        };
        recognition.lang = 'ru-RU';
        recognition.start();
    }
}

function setUsername(callback) {

    if (!('webkitSpeechRecognition' in window)) {
        upgrade();
    }

    speak('Добрый день! Пожалуйста сообщите, как вас зовут.', function() {
        speak('Назовите ваше имя', function() {
            hear(function(result) {
                $cookies.put('username', result);
                speak('Спасибо! Теперь назовите ваше отчество.', function() {
                    hear(function(result) {
                        $cookies.put('username', $cookies.get('username') + ' ' + result);
                        callback();
                    });
                });
            });
        });
    });

    /*(function() {
     var respond = function(event) {
     var text = '';
     for (var i = event.resultIndex; i < event.results.length; ++i) {
     var result = event.results[i];
     text += result[0].transcript;
     if (result.isFinal) {
     output.innerHTML = text;
     output.style.color = 'black';
     output = createOutput();
     speak(text);
     } else {
     output.innerHTML = text;
     }
     }
     }
     var createOutput = function() {
     var output = document.createElement('output');
     output.style.color = 'gray';
     document.body.appendChild(output);
     return output;
     }
     var speak = function(text) {
     // chrome://flags -> Enable experimental Web Platform features
     var utterance = new SpeechSynthesisUtterance(text);
     utterance.lang = 'en_GB';
     utterance.volume = 1; // 0 to 1
     utterance.rate = 1; // 0.1 to 10
     utterance.pitch = 1; //0 to 2
     window.speechSynthesis.speak(utterance);
     }
     var listen = function() {
     var recognition = new webkitSpeechRecognition();
     recognition.continuous = true;
     recognition.interimResults = true;
     recognition.lang = 'en_GB';
     recognition.start();
     recognition.onresult = respond;
     //recognition.onend = function(event) { console.log(event) };
     }
     var output = createOutput();
     listen();
     })();*/


}

var plannerApp = angular.module('plannerApp', ['ngCookies']);

plannerApp.controller('PlannerCtrl', function ($scope, $cookies) {
    function greatings() {
        $scope.username = $cookies.get('username');
        //$scope.username = "Тимофей Станиславович";
        speak('Добрый день, ' + $scope.username + '!');
    }
    if(!$cookies.get('username')) {
        setUsername(greatings);
    } else {
        greatings();
    }
});

// TODO: в настройках можно менять username, метод отбора задач
// В начале, когда не задан, можно ввести свои имя и отчество при регистрации,
// Также - спрашивает, "Какой тип отбора задач вы хотите выбрать.
//  Мы можем предложить вам популярный метод - матрица Эйзерхауера.
//  Так как работа над срочными и важными делами, так сказать, тушение пожаров,
//  приводит к их повторному возникновению, предлагаем также метод отбора по отдаче
//  на вложение относительно важности задач и того, насколько легко их выполнить.
//  Это позволит сосредоточиться на своем круге влияния, расшыряя его! Выбирайте метод"

