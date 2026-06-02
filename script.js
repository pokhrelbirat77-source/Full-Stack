/* ============================================================
   script.js - ePortfolio JavaScript (Version 2)

   All functions are attached to HTML via onclick= or
   addEventListener so there are no "not defined" errors.

   Contents:
   1.  Typing animation
   2.  Navbar active link highlight
   3.  CSS Flexbox live demo
   4.  Calculator
   5.  Character counter
   6.  Quote generator
   7.  Form validation demo
   8.  Contact form validation
   ============================================================ */


/* ============================================================
   1. TYPING ANIMATION
   ============================================================ */
var typingWords  = ['Web Developer', 'HTML Student', 'CSS Learner', 'JS Coder', 'Bootstrap User'];
var wordIdx      = 0;
var charIdx      = 0;
var isDeleting   = false;

function runTyping() {
    var el   = document.getElementById('typingWord');
    if (!el) return;

    var word = typingWords[wordIdx];

    if (!isDeleting) {
        el.textContent = word.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === word.length) {
            isDeleting = true;
            setTimeout(runTyping, 1400);
            return;
        }
    } else {
        el.textContent = word.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
            isDeleting = false;
            wordIdx    = (wordIdx + 1) % typingWords.length;
        }
    }

    setTimeout(runTyping, isDeleting ? 55 : 105);
}

runTyping();


/* ============================================================
   2. NAVBAR: SHADOW ON SCROLL + ACTIVE LINK HIGHLIGHT
   ============================================================ */
window.addEventListener('scroll', function () {
// Highlight the correct nav link based on scroll position
    var sections = document.querySelectorAll('section[id]');
    var links    = document.querySelectorAll('#navLinks .nav-link');
    var offset   = 100;

    sections.forEach(function (sec) {
        var top    = sec.offsetTop - offset;
        var bottom = top + sec.offsetHeight;
        if (window.scrollY >= top && window.scrollY < bottom) {
            links.forEach(function (l) { l.classList.remove('active-link'); });
            var match = document.querySelector('#navLinks a[href="#' + sec.id + '"]');
            if (match) match.classList.add('active-link');
        }
    });
});


/* ============================================================
   4. CSS FLEXBOX LIVE DEMO
   ============================================================ */
function setFlex(value) {
    var demo  = document.getElementById('flexDemo');
    var label = document.getElementById('flexLabel');
    if (demo)  demo.style.justifyContent = value;
    if (label) label.textContent = value;
}


/* ============================================================
   5. CALCULATOR (full button-based)
   Stores current number, previous number and operator.
   ============================================================ */
var calcCurrent   = '0';   // What is on the display right now
var calcPrevious  = '';    // The first number stored before operator
var calcOperator  = null;  // Which operator was pressed (+, -, *, /)
var calcFresh     = false; // Should the next digit start a new number?

// Update the display element
function calcUpdateDisplay(val) {
    var el = document.getElementById('calcDisplay');
    if (el) el.textContent = val;
}

// User pressed a number button
function calcNum(digit) {
    if (calcFresh) {
        calcCurrent = digit;
        calcFresh   = false;
    } else {
        // Don't allow more than one leading zero
        if (calcCurrent === '0' && digit !== '.') {
            calcCurrent = digit;
        } else {
            // Limit display length to 12 digits
            if (calcCurrent.length < 12) {
                calcCurrent += digit;
            }
        }
    }
    calcUpdateDisplay(calcCurrent);
}

// User pressed the decimal point
function calcDot() {
    if (calcFresh) {
        calcCurrent = '0.';
        calcFresh   = false;
    } else if (!calcCurrent.includes('.')) {
        calcCurrent += '.';
    }
    calcUpdateDisplay(calcCurrent);
}

// User pressed an operator (+, -, *, /)
function calcOp(op) {
    // If there's already a pending operation, calculate it first
    if (calcOperator && !calcFresh) {
        calcEquals();
    }
    calcPrevious = calcCurrent;
    calcOperator = op;
    calcFresh    = true;
}

// User pressed equals
function calcEquals() {
    if (!calcOperator || calcPrevious === '') return;

    var a      = parseFloat(calcPrevious);
    var b      = parseFloat(calcCurrent);
    var result = 0;

    if (calcOperator === '+') result = a + b;
    if (calcOperator === '-') result = a - b;
    if (calcOperator === '*') result = a * b;
    if (calcOperator === '/') {
        if (b === 0) {
            calcUpdateDisplay('Error');
            calcClear();
            return;
        }
        result = a / b;
    }

    // Avoid floating point display issues like 0.1 + 0.2 = 0.30000000001
    result = Math.round(result * 1e10) / 1e10;

    calcCurrent  = String(result);
    calcPrevious = '';
    calcOperator = null;
    calcFresh    = true;
    calcUpdateDisplay(calcCurrent);
}

// Clear everything
function calcClear() {
    calcCurrent  = '0';
    calcPrevious = '';
    calcOperator = null;
    calcFresh    = false;
    calcUpdateDisplay('0');
}

// Toggle positive / negative
function calcSign() {
    calcCurrent = String(parseFloat(calcCurrent) * -1);
    calcUpdateDisplay(calcCurrent);
}

// Convert to percentage
function calcPercent() {
    calcCurrent = String(parseFloat(calcCurrent) / 100);
    calcUpdateDisplay(calcCurrent);
}


/* ============================================================
   6. CHARACTER COUNTER
   ============================================================ */
function updateCharCount() {
    var area    = document.getElementById('charArea');
    var numEl   = document.getElementById('charNum');
    var fillEl  = document.getElementById('charBarFill');
    var msgEl   = document.getElementById('charMsg');
    var pctEl   = document.getElementById('charPct');

    if (!area) return;

    var max     = 200;
    var current = area.value.length;
    var pct     = (current / max) * 100;

    // Update the number and percentage
    if (numEl) numEl.textContent = current;
    if (pctEl) pctEl.textContent = Math.round(pct) + '%';

    // Update the progress bar width
    if (fillEl) {
        fillEl.style.width = pct + '%';

        // Change bar colour depending on how full it is
        if (pct < 60)       fillEl.style.background = '#2f6fb0';  // blue (fine)
        else if (pct < 85)  fillEl.style.background = '#f39c12';  // orange (warning)
        else                fillEl.style.background = '#c94545';  // red (nearly full)
    }

    // Update the message
    if (msgEl) {
        var left = max - current;
        if (current === 0)        msgEl.textContent = 'Start typing above...';
        else if (left > 50)       msgEl.textContent = 'Looking good! ' + left + ' characters remaining.';
        else if (left > 20)       msgEl.textContent = 'Getting close - ' + left + ' characters left.';
        else if (left > 0)        msgEl.textContent = ' Almost at the limit! Only ' + left + ' left.';
        else                      msgEl.textContent = ' Character limit reached!';

        // Change message colour
        msgEl.style.color = pct >= 85 ? '#e74c3c' : pct >= 60 ? '#f39c12' : '#636e72';
    }
}


/* ============================================================
   7. RANDOM QUOTE GENERATOR
   ============================================================ */
var quotes = [
    { text: 'Every expert was once a beginner.',                       author: 'Helen Hayes'    },
    { text: 'The best way to learn to code is by coding.',             author: 'Unknown'        },
    { text: 'First, solve the problem. Then, write the code.',         author: 'John Johnson'   },
    { text: 'Make it work, make it right, make it fast.',              author: 'Kent Beck'      },
    { text: 'Code is like humour. When you have to explain it, it\'s bad.', author: 'Cory House' },
    { text: 'The only way to do great work is to love what you do.',   author: 'Steve Jobs'     },
    { text: 'Simplicity is the soul of efficiency.',                   author: 'Austin Freeman' },
    { text: 'Learning to code is the closest thing to a superpower.',  author: 'Drew Houston'   },
];

function generateQuote() {
    var idx    = Math.floor(Math.random() * quotes.length);
    var q      = quotes[idx];

    var textEl   = document.getElementById('quoteText');
    var authorEl = document.getElementById('quoteAuthor');
    var card     = document.getElementById('quoteCard');

    if (textEl)   textEl.textContent   = q.text;
    if (authorEl) authorEl.textContent = '- ' + q.author;

    // Small fade animation to make it feel alive
    if (card) {
        card.style.opacity = '0';
        setTimeout(function () { card.style.opacity = '1'; }, 100);
        card.style.transition = 'opacity 0.3s';
    }
}


/* ============================================================
   8. FORM VALIDATION DEMO (JavaScript section)
   ============================================================ */
function runValidation() {
    // Clear old messages
    document.getElementById('valNameErr').textContent  = '';
    document.getElementById('valEmailErr').textContent = '';
    document.getElementById('valAgeErr').textContent   = '';
    document.getElementById('valSuccess').textContent  = '';

    var name  = document.getElementById('valName').value.trim();
    var email = document.getElementById('valEmail').value.trim();
    var age   = document.getElementById('valAge').value.trim();
    var ok    = true;

    // Name check
    if (name === '') {
        document.getElementById('valNameErr').textContent = ' Name is required.';
        ok = false;
    } else if (name.length < 2) {
        document.getElementById('valNameErr').textContent = ' Name must be at least 2 characters.';
        ok = false;
    }

    // Email check using a regular expression
    // /^...$/  means the whole string must match this pattern
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        document.getElementById('valEmailErr').textContent = ' Email is required.';
        ok = false;
    } else if (!emailPattern.test(email)) {
        document.getElementById('valEmailErr').textContent = ' Please enter a valid email (e.g. alex@email.com).';
        ok = false;
    }

    // Age check - must be a number and 16 or over
    if (age === '') {
        document.getElementById('valAgeErr').textContent = ' Age is required.';
        ok = false;
    } else if (isNaN(age) || Number(age) < 16) {
        document.getElementById('valAgeErr').textContent = ' You must be at least 16 to register.';
        ok = false;
    }

    if (ok) {
        document.getElementById('valSuccess').textContent = ' All fields valid! Form would now submit.';
        document.getElementById('valForm').reset();
    }

    return false; // Always prevent actual submission on this demo
}


/* ============================================================
   9. CONTACT FORM VALIDATION
   ============================================================ */
function submitContact() {
    // Clear all errors first
    ['cNameErr','cEmailErr','cSubjectErr','cMessageErr'].forEach(function(id) {
        document.getElementById(id).textContent = '';
    });
    document.getElementById('cSuccess').innerHTML = '';

    var name    = document.getElementById('cName').value.trim();
    var email   = document.getElementById('cEmail').value.trim();
    var subject = document.getElementById('cSubject').value.trim();
    var message = document.getElementById('cMessage').value.trim();
    var ep      = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var ok      = true;

    if (!name)                   { document.getElementById('cNameErr').textContent    = ' Name is required.';          ok = false; }
    if (!ep.test(email))         { document.getElementById('cEmailErr').textContent   = ' Valid email is required.';   ok = false; }
    if (!subject)                { document.getElementById('cSubjectErr').textContent = ' Subject is required.';       ok = false; }
    if (message.length < 10)     { document.getElementById('cMessageErr').textContent = ' Message is too short.';      ok = false; }

    if (ok) {
        document.getElementById('cSuccess').innerHTML =
            '<div class="alert alert-success py-2 small mt-1">' +
            ' Thanks, <strong>' + name + '</strong>! Your message has been sent.</div>';
        document.getElementById('contactForm').reset();
    }

    return false;
}



// Highlight the current topic page in the navbar.
document.addEventListener('DOMContentLoaded', function () {
    var currentPage = document.body.getAttribute('data-page');
    if (!currentPage) return;

    var links = document.querySelectorAll('#navLinks .nav-link');
    links.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active-link');
        }
    });
});