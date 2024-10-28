import './Loading.css';

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function setRandomColors() {
  document.documentElement.style.setProperty('--color-cuerda', getRandomColor());
  document.documentElement.style.setProperty('--color-ovillo', `radial-gradient(circle at top left, ${getRandomColor()} 0%, ${getRandomColor()} 40%, ${getRandomColor()} 65%, ${getRandomColor()} 100%)`);
  document.documentElement.style.setProperty('--color-patas-superiores', `linear-gradient(to right, ${getRandomColor()}, ${getRandomColor()})`);
  document.documentElement.style.setProperty('--color-pata-superior-izquierda', getRandomColor());
  document.documentElement.style.setProperty('--color-pata-superior-derecha', getRandomColor());
  document.documentElement.style.setProperty('--color-cuerpo', `radial-gradient(circle at 20% 20%, ${getRandomColor()}, ${getRandomColor()})`);
  document.documentElement.style.setProperty('--color-patas-inferiores', `linear-gradient(to right, ${getRandomColor()}, ${getRandomColor()})`);
  document.documentElement.style.setProperty('--color-cola', `linear-gradient(to right, ${getRandomColor()}, ${getRandomColor()})`);
  document.documentElement.style.setProperty('--color-cabeza', `radial-gradient(circle at 50% 50%, ${getRandomColor()}, ${getRandomColor()} 60%, ${getRandomColor()})`);
  document.documentElement.style.setProperty('--color-oreja-izquierda-exterior', getRandomColor());
  document.documentElement.style.setProperty('--color-oreja-izquierda-interior', getRandomColor());
  document.documentElement.style.setProperty('--color-oreja-derecha', getRandomColor());
  document.documentElement.style.setProperty('--color-ojos', getRandomColor());
  document.documentElement.style.setProperty('--color-nariz', getRandomColor());
  document.documentElement.style.setProperty('--color-boca', getRandomColor());
  document.documentElement.style.setProperty('--color-bigotes', getRandomColor());
}

// document.addEventListener('DOMContentLoaded', setRandomColors);

function Loading(){
    return (<>
        <div className='loadingView'>
          {catBalancing()}
        </div>
        </>
    );
}

/* HTML y CSS obtenido de:
https://speckyboy.com/css-javascript-code-snippets-celebrating-cats */
function catBalancing(){
  return(<>
  <div className="all-wrap">  
    <div className="all">
      <div className="yarn"></div>
      <div className="cat-wrap">    
        <div className="cat">
          <div className="cat-upper">
            <div className="cat-leg"></div>
            <div className="cat-leg"></div>
            <div className="cat-head">
              <div className="cat-ears">
                <div className="cat-ear"></div>
                <div className="cat-ear"></div>
              </div>
              <div className="cat-face">
                <div className="cat-eyes"></div>
                <div className="cat-mouth"></div>
                <div className="cat-whiskers"></div>
              </div>
            </div>
          </div>
          <div className="cat-lower-wrap">
            <div className="cat-lower">
              <div className="cat-leg">
                <div className="cat-leg">
                  <div className="cat-leg">
                    <div className="cat-leg">
                      <div className="cat-leg">
                        <div className="cat-leg">
                          <div className="cat-leg">
                            <div className="cat-leg">
                              <div className="cat-leg">
                                <div className="cat-leg">
                                  <div className="cat-leg">
                                    <div className="cat-leg">
                                      <div className="cat-leg">
                                        <div className="cat-leg">
                                          <div className="cat-leg">
                                            <div className="cat-leg">
                                              <div className="cat-paw"></div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cat-leg">
                <div className="cat-leg">
                  <div className="cat-leg">
                    <div className="cat-leg">
                      <div className="cat-leg">
                        <div className="cat-leg">
                          <div className="cat-leg">
                            <div className="cat-leg">
                              <div className="cat-leg">
                                <div className="cat-leg">
                                  <div className="cat-leg">
                                    <div className="cat-leg">
                                      <div className="cat-leg">
                                        <div className="cat-leg">
                                          <div className="cat-leg">
                                            <div className="cat-leg">
                                              <div className="cat-paw"></div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cat-tail">
                <div className="cat-tail">
                  <div className="cat-tail">
                    <div className="cat-tail">
                      <div className="cat-tail">
                        <div className="cat-tail">
                          <div className="cat-tail">
                            <div className="cat-tail">
                              <div className="cat-tail">
                                <div className="cat-tail">
                                  <div className="cat-tail">
                                    <div className="cat-tail">
                                      <div className="cat-tail">
                                        <div className="cat-tail">
                                          <div className="cat-tail">
                                            <div className="cat-tail -end"></div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </>)
}

export default Loading;