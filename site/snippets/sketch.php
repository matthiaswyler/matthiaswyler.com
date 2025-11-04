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
              // Only replace standalone function calls, not method calls (e.g., wordList.push stays as-is)
              let modifiedCode = code
                .replace(/function\s+setup\s*\(\)/g, 'p.setup = function()')
                .replace(/function\s+draw\s*\(\)/g, 'p.draw = function()')
                // Replace width, height, mouseX, mouseY, frameCount only when used as standalone variables (not properties/methods)
                .replace(/\bwidth\b(?![.\(])/g, 'p.width')
                .replace(/\bheight\b(?![.\(])/g, 'p.height')
                .replace(/\bmouseX\b(?![.\(])/g, 'p.mouseX')
                .replace(/\bmouseY\b(?![.\(])/g, 'p.mouseY')
                .replace(/\bframeCount\b(?![.\(])/g, 'p.frameCount')
                // Constants - only when standalone
                .replace(/\bWEBGL\b(?![.\(])/g, 'p.WEBGL')
                .replace(/\bCENTER\b(?![.\(])/g, 'p.CENTER')
                .replace(/\bCORNER\b(?![.\(])/g, 'p.CORNER')
                // p5.js functions - only replace when NOT preceded by a dot (to avoid replacing method calls)
                // Using (^|[^.]) pattern to match start of line or non-dot character before the function
                .replace(/(^|[^.])\bcreateCanvas\s*\(/g, '$1p.createCanvas(')
                .replace(/(^|[^.])\bpixelDensity\s*\(/g, '$1p.pixelDensity(')
                .replace(/(^|[^.])\bframeRate\s*\(/g, '$1p.frameRate(')
                .replace(/(^|[^.])\bloadFont\s*\(/g, '$1p.loadFont(')
                .replace(/(^|[^.])\bbackground\s*\(/g, '$1p.background(')
                .replace(/(^|[^.])\btextFont\s*\(/g, '$1p.textFont(')
                .replace(/(^|[^.])\bpush\s*\(/g, '$1p.push(')
                .replace(/(^|[^.])\bpop\s*\(/g, '$1p.pop(')
                .replace(/(^|[^.])\btranslate\s*\(/g, '$1p.translate(')
                .replace(/(^|[^.])\bscale\s*\(/g, '$1p.scale(')
                .replace(/(^|[^.])\bmap\s*\(/g, '$1p.map(')
                .replace(/(^|[^.])\bradians\s*\(/g, '$1p.radians(')
                .replace(/(^|[^.])\bdegrees\s*\(/g, '$1p.degrees(')
                .replace(/(^|[^.])\bsin\s*\(/g, '$1p.sin(')
                .replace(/(^|[^.])\bcos\s*\(/g, '$1p.cos(')
                .replace(/(^|[^.])\btan\s*\(/g, '$1p.tan(')
                .replace(/(^|[^.])\basin\s*\(/g, '$1p.asin(')
                .replace(/(^|[^.])\bacos\s*\(/g, '$1p.acos(')
                .replace(/(^|[^.])\batan\s*\(/g, '$1p.atan(')
                .replace(/(^|[^.])\batan2\s*\(/g, '$1p.atan2(')
                .replace(/(^|[^.])\brotate\s*\(/g, '$1p.rotate(')
                .replace(/(^|[^.])\brotateY\s*\(/g, '$1p.rotateY(')
                .replace(/(^|[^.])\brotateX\s*\(/g, '$1p.rotateX(')
                .replace(/(^|[^.])\brectMode\s*\(/g, '$1p.rectMode(')
                .replace(/(^|[^.])\btextAlign\s*\(/g, '$1p.textAlign(')
                .replace(/(^|[^.])\btextSize\s*\(/g, '$1p.textSize(')
                .replace(/(^|[^.])\btextWidth\s*\(/g, '$1p.textWidth(')
                .replace(/(^|[^.])\bfill\s*\(/g, '$1p.fill(')
                .replace(/(^|[^.])\bnoFill\s*\(/g, '$1p.noFill(')
                .replace(/(^|[^.])\bstroke\s*\(/g, '$1p.stroke(')
                .replace(/(^|[^.])\bnoStroke\s*\(/g, '$1p.noStroke(')
                .replace(/(^|[^.])\bstrokeWeight\s*\(/g, '$1p.strokeWeight(')
                .replace(/(^|[^.])\brect\s*\(/g, '$1p.rect(')
                .replace(/(^|[^.])\bsquare\s*\(/g, '$1p.square(')
                .replace(/(^|[^.])\bellipse\s*\(/g, '$1p.ellipse(')
                .replace(/(^|[^.])\btriangle\s*\(/g, '$1p.triangle(')
                .replace(/(^|[^.])\btext\s*\(/g, '$1p.text(')
                .replace(/(^|[^.])\brandom\s*\(/g, '$1p.random(');
              
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
                  .replace(/\bp\.mouseX\b/g, 'window["' + getMouseXKey + '"]()')
                  .replace(/\bp\.mouseY\b/g, 'window["' + getMouseYKey + '"]()');
                
                // Wrap code with mouse interceptor functions
                // When disabled, always return center values (width/2) for neutral rotation
                // When enabled, use actual mouse position, but fall back to center if mouse hasn't moved yet
                // The sketch maps: map(mouseY, 0, width, -500, 500) and map(mouseX, 0, width, -500, 500)
                // To get 0 rotation, we need map(value, 0, width, -500, 500) = 0
                // Solving: (value / width) * 1000 - 500 = 0 → value = width / 2
                finalCode = 
                  'window["' + getMouseXKey + '"] = function() { ' +
                  '  if (window["' + mouseStateKey + '"]) { ' +
                  '    const mx = p.mouseX; ' +
                  '    if (mx === 0 || mx === undefined) { ' +
                  '      return p.width / 2; ' +
                  '    } ' +
                  '    window["' + lastMouseXKey + '"] = mx; ' +
                  '    return mx; ' +
                  '  } ' +
                  '  return p.width / 2; ' +
                  '}; ' +
                  'window["' + getMouseYKey + '"] = function() { ' +
                  '  if (window["' + mouseStateKey + '"]) { ' +
                  '    const my = p.mouseY; ' +
                  '    if (my === 0 || my === undefined) { ' +
                  '      return p.width / 2; ' +
                  '    } ' +
                  '    window["' + lastMouseYKey + '"] = my; ' +
                  '    return my; ' +
                  '  } ' +
                  '  return p.width / 2; ' +
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
                
                new p5(function(p) {
                  try {
                    // Replace createCanvas calls to use container width dynamically
                    const modifiedWrappedCode = finalCode.replace(
                      /p\.createCanvas\((\d+),\s*(\d+)/g,
                      `p.createCanvas(${containerWidth}, ${containerWidth}`
                    );
                    
                    eval(modifiedWrappedCode);
                    
                    // Handle window resize to update canvas size
                    let resizeTimeout;
                    const resizeCanvas = () => {
                      clearTimeout(resizeTimeout);
                      resizeTimeout = setTimeout(() => {
                        const newWidth = container.offsetWidth || containerWidth;
                        if (p.width !== newWidth && newWidth > 0) {
                          p.resizeCanvas(newWidth, newWidth);
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
                    })(containerId, '<?= $canvasId ?>_mouseEnabled', p);
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

