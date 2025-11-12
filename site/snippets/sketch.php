<?php
/**
 * @var \Kirby\Cms\Page $sketch
 */

$jsFile = $sketch->file('sketch.js');
$canvasId = 'sketch-' . $sketch->slug();

// Check if sketch uses mouse controls
$hasMouseControls = false;
if ($jsFile) {
  $sketchContent = $jsFile->read();
  $hasMouseControls = preg_match('/\bmouseX\b|\bmouseY\b/i', $sketchContent) === 1;
}

?>
<div class="sketch-container" data-sketch-id="<?= $sketch->id() ?>">
  <?php if ($jsFile) : ?>
    <div id="<?= $canvasId ?>" class="sketch-wrapper">
      <?php if ($hasMouseControls) : ?>
        <label class="sketch-toggle" for="<?= $canvasId ?>-toggle" aria-label="Toggle mouse interactivity" title="Toggle mouse interactivity">
          <input type="checkbox" id="<?= $canvasId ?>-toggle">
          <span class="sketch-toggle-slider"></span>
        </label>
      <?php endif ?>
    </div>
    <script>
      // Wait for p5.js to be fully loaded before loading the sketch
      (function() {
        const containerId = '<?= $canvasId ?>';
        const sketchUrl = '<?= $jsFile->url() ?>';
        
        function loadSketch() {
          if (typeof p5 === 'undefined') {
            setTimeout(loadSketch, 50);
            return;
          }
          
          const container = document.getElementById(containerId);
          if (!container) {
            return;
          }
          
          // Load the sketch file
          fetch(sketchUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to load sketch: ' + response.status);
              }
              return response.text();
            })
            .then(code => {
              // Check if code uses mouse controls
              const hasMouseControls = /\bmouseX\b|\bmouseY\b/i.test(code);
              
              // Transform global mode code to instance mode
              // Use 'sketch' as instance variable name to avoid conflicts with function parameters named 'p'
              // Only replace standalone function calls, not method calls (e.g., wordList.push stays as-is)
              let modifiedCode = code
                .replace(/function\s+setup\s*\(\)/g, 'sketch.setup = function()')
                .replace(/function\s+draw\s*\(\)/g, 'sketch.draw = function()')
                // p5.js functions - transform BEFORE variables to avoid conflicts
                // Using (^|[^.\w]) pattern to match start of line or non-word character before the function
                .replace(/(^|[^.\w])\bnoiseSeed\s*\(/g, '$1sketch.noiseSeed(')
                .replace(/(^|[^.\w])\bnoise\s*\(/g, '$1sketch.noise(')
                .replace(/(^|[^.\w])\bcreateCanvas\s*\(/g, '$1sketch.createCanvas(')
                .replace(/(^|[^.\w])\bpixelDensity\s*\(/g, '$1sketch.pixelDensity(')
                .replace(/(^|[^.\w])\bframeRate\s*\(/g, '$1sketch.frameRate(')
                .replace(/(^|[^.\w])\bloadFont\s*\(/g, '$1sketch.loadFont(')
                .replace(/(^|[^.\w])\bbackground\s*\(/g, '$1sketch.background(')
                .replace(/(^|[^.\w])\btextFont\s*\(/g, '$1sketch.textFont(')
                .replace(/(^|[^.\w])\bpush\s*\(/g, '$1sketch.push(')
                .replace(/(^|[^.\w])\bpop\s*\(/g, '$1sketch.pop(')
                .replace(/(^|[^.\w])\btranslate\s*\(/g, '$1sketch.translate(')
                .replace(/(^|[^.\w])\bscale\s*\(/g, '$1sketch.scale(')
                .replace(/(^|[^.\w])\bmap\s*\(/g, '$1sketch.map(')
                .replace(/(^|[^.\w])\bradians\s*\(/g, '$1sketch.radians(')
                .replace(/(^|[^.\w])\bdegrees\s*\(/g, '$1sketch.degrees(')
                .replace(/(^|[^.\w])\bsin\s*\(/g, '$1sketch.sin(')
                .replace(/(^|[^.\w])\bcos\s*\(/g, '$1sketch.cos(')
                .replace(/(^|[^.\w])\btan\s*\(/g, '$1sketch.tan(')
                .replace(/(^|[^.\w])\basin\s*\(/g, '$1sketch.asin(')
                .replace(/(^|[^.\w])\bacos\s*\(/g, '$1sketch.acos(')
                .replace(/(^|[^.\w])\batan\s*\(/g, '$1sketch.atan(')
                .replace(/(^|[^.\w])\batan2\s*\(/g, '$1sketch.atan2(')
                .replace(/(^|[^.\w])\brotate\s*\(/g, '$1sketch.rotate(')
                .replace(/(^|[^.\w])\brotateY\s*\(/g, '$1sketch.rotateY(')
                .replace(/(^|[^.\w])\brotateX\s*\(/g, '$1sketch.rotateX(')
                .replace(/(^|[^.\w])\brectMode\s*\(/g, '$1sketch.rectMode(')
                .replace(/(^|[^.\w])\btextAlign\s*\(/g, '$1sketch.textAlign(')
                .replace(/(^|[^.\w])\btextSize\s*\(/g, '$1sketch.textSize(')
                .replace(/(^|[^.\w])\btextWidth\s*\(/g, '$1sketch.textWidth(')
                .replace(/(^|[^.\w])\bfill\s*\(/g, '$1sketch.fill(')
                .replace(/(^|[^.\w])\bnoFill\s*\(/g, '$1sketch.noFill(')
                .replace(/(^|[^.\w])\bstroke\s*\(/g, '$1sketch.stroke(')
                .replace(/(^|[^.\w])\bnoStroke\s*\(/g, '$1sketch.noStroke(')
                .replace(/(^|[^.\w])\bstrokeWeight\s*\(/g, '$1sketch.strokeWeight(')
                .replace(/(^|[^.\w])\brect\s*\(/g, '$1sketch.rect(')
                .replace(/(^|[^.\w])\bsquare\s*\(/g, '$1sketch.square(')
                .replace(/(^|[^.\w])\bellipse\s*\(/g, '$1sketch.ellipse(')
                .replace(/(^|[^.\w])\btriangle\s*\(/g, '$1sketch.triangle(')
                .replace(/(^|[^.\w])\barc\s*\(/g, '$1sketch.arc(')
                .replace(/(^|[^.\w])\btext\s*\(/g, '$1sketch.text(')
                .replace(/(^|[^.\w])\brandom\s*\(/g, '$1sketch.random(')
                .replace(/(^|[^.\w])\bcreateVector\s*\(/g, '$1sketch.createVector(')
                .replace(/(^|[^.\w])\bsqrt\s*\(/g, '$1sketch.sqrt(')
                .replace(/(^|[^.\w])\bpow\s*\(/g, '$1sketch.pow(')
                // Replace width, height, mouseX, mouseY, frameCount only when used as standalone variables (not properties/methods)
                // Must come AFTER function replacements to avoid conflicts
                .replace(/\bwidth\b(?![.\w\(])/g, 'sketch.width')
                .replace(/\bheight\b(?![.\w\(])/g, 'sketch.height')
                .replace(/\bmouseX\b(?![.\w\(])/g, 'sketch.mouseX')
                .replace(/\bmouseY\b(?![.\w\(])/g, 'sketch.mouseY')
                .replace(/\bframeCount\b(?![.\w\(])/g, 'sketch.frameCount')
                // Constants - only when standalone
                .replace(/\bWEBGL\b(?![.\w\(])/g, 'sketch.WEBGL')
                .replace(/\bCENTER\b(?![.\w\(])/g, 'sketch.CENTER')
                .replace(/\bCORNER\b(?![.\w\(])/g, 'sketch.CORNER')
                .replace(/\bTWO_PI\b(?![.\w\(])/g, 'sketch.TWO_PI')
                .replace(/\bPI\b(?![.\w\(])/g, 'sketch.PI');
              
              // Only set up mouse wrapper if sketch uses mouse controls
              let finalCode = modifiedCode;
              let mouseStateKey = null;
              
              if (hasMouseControls) {
                // Shared state for mouse interactivity toggle
                mouseStateKey = containerId + '_mouseEnabled';
                const getMouseXKey = containerId + '_getMouseX';
                const getMouseYKey = containerId + '_getMouseY';
                const lastMouseXKey = containerId + '_lastMouseX';
                const lastMouseYKey = containerId + '_lastMouseY';
                
                window[mouseStateKey] = false; // Start with mouse interactivity disabled
                window[lastMouseXKey] = null; // Store last mouse position before disabling
                window[lastMouseYKey] = null;
                
                // Replace mouseX/mouseY in code with wrapper functions
                let codeWithMouseWrapper = modifiedCode
                  .replace(/\bsketch\.mouseX\b/g, 'window["' + getMouseXKey + '"]()')
                  .replace(/\bsketch\.mouseY\b/g, 'window["' + getMouseYKey + '"]()');
                
                // Wrap code with mouse interceptor functions
                // When disabled, always return center values (width/2) for neutral rotation
                // When enabled, use actual mouse position, but fall back to center if mouse hasn't moved yet
                // The sketch maps: map(mouseY, 0, width, -500, 500) and map(mouseX, 0, width, -500, 500)
                // To get 0 rotation, we need map(value, 0, width, -500, 500) = 0
                // Solving: (value / width) * 1000 - 500 = 0 → value = width / 2
                finalCode = 
                  'window["' + getMouseXKey + '"] = function() { ' +
                  '  if (window["' + mouseStateKey + '"]) { ' +
                  '    const mx = sketch.mouseX; ' +
                  '    if (mx === 0 || mx === undefined) { ' +
                  '      return sketch.width / 2; ' +
                  '    } ' +
                  '    window["' + lastMouseXKey + '"] = mx; ' +
                  '    return mx; ' +
                  '  } ' +
                  '  return sketch.width / 2; ' +
                  '}; ' +
                  'window["' + getMouseYKey + '"] = function() { ' +
                  '  if (window["' + mouseStateKey + '"]) { ' +
                  '    const my = sketch.mouseY; ' +
                  '    if (my === 0 || my === undefined) { ' +
                  '      return sketch.width / 2; ' +
                  '    } ' +
                  '    window["' + lastMouseYKey + '"] = my; ' +
                  '    return my; ' +
                  '  } ' +
                  '  return sketch.width / 2; ' +
                  '}; ' +
                  codeWithMouseWrapper;
              }
              
              // Wait for container to have a width (after layout)
              const initSketch = () => {
                const containerWidth = container.offsetWidth;
                if (!containerWidth || containerWidth === 0) {
                  requestAnimationFrame(initSketch);
                  return;
                }
                
                new p5(function(sketch) {
                  try {
                    // Replace createCanvas calls to use container width dynamically
                    const modifiedWrappedCode = finalCode.replace(
                      /sketch\.createCanvas\((\d+),\s*(\d+)/g,
                      `sketch.createCanvas(${containerWidth}, ${containerWidth}`
                    );
                    
                    eval(modifiedWrappedCode);
                    
                    // Handle window resize to update canvas size
                    let resizeTimeout;
                    const resizeCanvas = () => {
                      clearTimeout(resizeTimeout);
                      resizeTimeout = setTimeout(() => {
                        const newWidth = container.offsetWidth || containerWidth;
                        if (sketch.width !== newWidth && newWidth > 0) {
                          sketch.resizeCanvas(newWidth, newWidth);
                        }
                      }, 100);
                    };
                    
                    window.addEventListener('resize', resizeCanvas);
                    
                    // Toggle switch handler - only set up if mouse controls are used
                    <?php if ($hasMouseControls) : ?>
                    // Use IIFE to properly capture the variables in closure
                    (function(cId, mKey, p5Inst) {
                      // Use setTimeout to ensure DOM is ready
                      setTimeout(function() {
                        const toggleCheckbox = document.getElementById(cId + '-toggle');
                        if (toggleCheckbox && !toggleCheckbox.hasAttribute('data-listener-attached')) {
                          toggleCheckbox.setAttribute('data-listener-attached', 'true');
                          toggleCheckbox.addEventListener('change', function() {
                            const isEnabled = this.checked;
                            window[mKey] = isEnabled;
                            
                            // Trigger a redraw to immediately reflect the change
                            if (p5Inst) {
                              p5Inst.redraw();
                            }
                          });
                        }
                      }, 0);
                    })(containerId, '<?= $canvasId ?>_mouseEnabled', sketch);
                    <?php endif ?>
                  } catch (error) {
                    console.error('Sketch loading error:', error);
                    const errorMsg = document.createElement('p');
                    errorMsg.className = 'sketch-error';
                    errorMsg.textContent = 'Error loading sketch: ' + error.message;
                    container.appendChild(errorMsg);
                  }
                }, container);
              };
              
              // Start initialization
              initSketch();
            })
            .catch(error => {
              const errorMsg = document.createElement('p');
              errorMsg.className = 'sketch-error';
              errorMsg.textContent = 'Failed to load sketch.';
              container.appendChild(errorMsg);
            });
        }
        
        // Start loading after p5.js is loaded
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function() {
            setTimeout(loadSketch, 300);
          });
        } else {
          setTimeout(loadSketch, 300);
        }
      })();
    </script>
  <?php else : ?>
    <p class="sketch-error">No sketch.js or scetch.js file found for this sketch.</p>
  <?php endif ?>
</div>

