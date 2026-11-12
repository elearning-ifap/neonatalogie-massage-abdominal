(function(){
  var screens = Array.prototype.slice.call(document.querySelectorAll('.screen'));
  var current = 0;
  var key = 'cht-massage-v09-progress';
  var quizKey = 'cht-massage-v09-quiz';
  var reviewKey = 'cht-massage-v09-reviews';
  var mappingKey = 'cht-massage-v12-video-associations';
  var microKey = 'cht-massage-v14-micro';
  var titles = screens.map(function(s){return s.getAttribute('data-title') || '';});
  var videoNames = ['DSCF3523_1_1.mp4','DSCF3524_1.mp4','DSCF3524_2.mp4','DSCF3524_3.mp4','DSCF3524_4.mp4','Eden.mp4'];
  var videoUrls = {};
  var mapping = {};
  try{ mapping=JSON.parse(localStorage.getItem(mappingKey)||'{}')||{}; }catch(e){mapping={};}
  var microQuestions = [{"q": "Lors du geste des traits tirés, quel repère faut-il respecter ?", "a": ["Observer la respiration et accompagner l’expiration.", "Exercer une poussée afin d’obtenir une selle."], "c": 0, "why": "Le support pédagogique décrit un mouvement accompagnant l’expiration. La poussée mécanique est à proscrire.", "source": "Protocole CHT, pages 3 et 11 ; précisions gestuelles de la v1.3 à confirmer."}, {"q": "Pour la virgule, quel repère est indiqué dans le protocole ?", "a": ["Deux ou trois doigts selon la taille et le poids du nouveau-né.", "Toujours utiliser toute la paume, sans adaptation."], "c": 0, "why": "La page 15 indique deux ou trois doigts pour la virgule et le « i », selon la morphologie.", "source": "Protocole CHT, page 15."}, {"q": "Quelle est la direction indiquée pour le geste « i » ?", "a": ["Vers le haut.", "Vers le bas."], "c": 1, "why": "La présentation du geste dans le prototype v1.3 indique un mouvement vers le bas. À confirmer lors de la validation métier.", "source": "Prototype v1.3 et photographie annotée du protocole CHT, page 11."}, {"q": "Quelle règle transversale s’applique à « Soleil et lune » ?", "a": ["Maintenir le contact : l’autre main est déjà en contact avant que la première s’arrête.", "Décoller les deux mains à chaque changement de mouvement."], "c": 0, "why": "Le protocole insiste sur la continuité du contact entre les mains.", "source": "Protocole CHT, page 15."}, {"q": "Quelle place le drainage occupe-t-il dans la séquence ?", "a": ["Il est facultatif.", "Il est obligatoire à chaque massage."], "c": 0, "why": "La planche des six gestes signale explicitement le drainage comme facultatif.", "source": "Protocole CHT, page 11."}, {"q": "Quelle précaution est cohérente avec l’enroulement du bassin ?", "a": ["Forcer la flexion des membres inférieurs pour évacuer les selles.", "Éviter une pression mécanique sur l’abdomen ; respecter la tolérance du nouveau-né."], "c": 1, "why": "Le protocole indique « Stop au tube de dentifrice » et proscrit l’idée d’une évacuation mécanique des selles.", "source": "Protocole CHT, pages 3 et 4."}];
  var microAnswers = {};
  try { microAnswers = JSON.parse(localStorage.getItem(microKey)||'{}') || {}; } catch(e) { microAnswers={}; }
  var videoValidatedNotice = 'Association vidéo–geste à confirmer par le référent métier CHT.';
  var quizIndex = 0, quizScore = 0, quizAnswered = [];
  var quiz = [
    {q:'Le massage abdominal doit-il être systématique face à un inconfort digestif ?',a:['Oui','Non, il faut vérifier l’indication et les critères'],c:1},
    {q:'Quel élément impose clairement de ne pas poursuivre ?',a:['Une instabilité hémodynamique','L’absence immédiate de selles'],c:0},
    {q:'Quel geste est facultatif dans la séquence ?',a:['La virgule','Le drainage','Soleil et lune'],c:1},
    {q:'Quelle règle est transversale aux gestes ?',a:['Rompre le contact entre deux mouvements','Maintenir un contact continu'],c:1},
    {q:'Quelle pratique est à éviter ?',a:['Le poids naturel de la main','Une poussée mécanique volontaire dans l’abdomen'],c:1},
    {q:'Face à des signes de dystimulation importants, que faire ?',a:['Poursuivre plus doucement','Arrêter et réévaluer'],c:1},
    {q:'Après le massage, l’absence immédiate de selles signifie-t-elle un échec ?',a:['Oui','Non'],c:1},
    {q:'Quelle pression appliquer pendant le massage abdominal ?',a:['Le poids naturel de la main, sans poussée supplémentaire dans l’abdomen','Une poussée ferme pour faire évacuer les selles'],c:0}
  ];


  function navHtml(){
    return titles.map(function(t,i){return '<button data-goto="'+i+'"><span class="n">'+(i+1)+'</span><span class="label">'+t+'</span></button>';}).join('');
  }
  document.getElementById('sideNav').innerHTML = navHtml();
  document.getElementById('mobileNav').innerHTML = navHtml();


  function show(i, save){
    i = Math.max(0,Math.min(screens.length-1,i));
    current=i;
    document.querySelectorAll('.video-card video').forEach(function(v){v.pause();});
    screens.forEach(function(s,j){s.classList.toggle('active',j===i);});
    document.querySelectorAll('.nav button').forEach(function(b){b.classList.toggle('active',Number(b.getAttribute('data-goto'))===i);});
    var pct = Math.round(((i+1)/screens.length)*100);
    document.getElementById('progressBar').style.width=pct+'%';
    document.getElementById('progressLabel').textContent='Écran '+(i+1)+' sur '+screens.length;
    document.getElementById('progressPct').textContent=pct+' %';
    document.getElementById('bottomTitle').textContent=titles[i];
    document.getElementById('prevBtn').disabled=i===0;
    document.getElementById('nextBtn').textContent=i===screens.length-1?'Fin':'Suivant →';
    if(save!==false) localStorage.setItem(key,String(i));
    window.scrollTo({top:0,behavior:'smooth'});
    hydrateVideos();
    if(titles[i]==='Situation finale') renderQuiz();
  }


  document.addEventListener('click',function(e){
    var g=e.target.closest('[data-goto]'); if(g){show(Number(g.getAttribute('data-goto')));closeOverlays();return;}
    var n=e.target.closest('[data-next]'); if(n){show(current+1);return;}
    var f=e.target.closest('.flip'); if(f){f.classList.toggle('open');}
  });
  document.getElementById('prevBtn').onclick=function(){show(current-1);};
  document.getElementById('nextBtn').onclick=function(){if(current<screens.length-1)show(current+1);};
  document.getElementById('resumeBtn').onclick=function(){var p=Number(localStorage.getItem(key)||0);show(p);};


  function bindQuestion(id, okText, badText){
    var box=document.querySelector('[data-question="'+id+'"]'); if(!box)return;
    var correct=box.getAttribute('data-correct'); var fb=document.getElementById('fb-'+id);
    box.querySelectorAll('.choice').forEach(function(b){
      b.onclick=function(){
        box.querySelectorAll('.choice').forEach(function(x){x.classList.remove('selected','correct','wrong');});
        var v=b.getAttribute('data-value'); b.classList.add('selected',v===correct?'correct':'wrong');
        fb.innerHTML=v===correct?okText:badText;fb.classList.add('show');
      };
    });
  }
  bindQuestion('q1','<strong>Exact.</strong> Le massage est un soin ciblé et non systématique. L’indication et la tolérance doivent être réévaluées.','<strong>À revoir.</strong> Le protocole insiste sur le caractère non systématique du soin.');
  bindQuestion('q20','<strong>Exact.</strong> L’objectif est la régularisation du transit, pas l’émission immédiate de selles.','<strong>Non.</strong> Une selle immédiate n’est pas le critère de réussite du massage.');


  document.querySelectorAll('.scenario-list .choice').forEach(function(b){
    b.onclick=function(){
      var v=b.getAttribute('data-scenario'),txt='';
      if(v==='stop')txt='<strong>Stopper / ne pas engager.</strong> La tolérance et la stabilité clinique priment.';
      if(v==='no')txt='<strong>Ne pas réaliser.</strong> Une pathologie digestive en cours fait partie des exclusions.';
      if(v==='wait')txt='<strong>Reporter.</strong> Le soin doit être réalisé à distance des alimentations.';
      document.getElementById('scenarioFb').innerHTML=txt;
    };
  });


  document.querySelectorAll('#prepChecklist input').forEach(function(c){
    c.onchange=function(){
      var all=Array.prototype.slice.call(document.querySelectorAll('#prepChecklist input'));
      var done=all.filter(function(x){return x.checked;}).length;
      var fb=document.getElementById('prepFb');
      fb.innerHTML='<strong>'+done+' / '+all.length+'</strong> conditions repérées.';
      fb.classList.add('show');
    };
  });


  document.querySelectorAll('.pressure').forEach(function(b){
    b.onclick=function(){
      var fb=document.getElementById('pressureFb');
      fb.innerHTML=b.getAttribute('data-pressure')==='bad'?'<strong>À éviter.</strong> Le massage ne correspond pas à une poussée mécanique dans l’abdomen.':'<strong>Repère compatible avec le protocole.</strong> Le poids de la main doit rester adapté, sans poussée supplémentaire.';
      fb.classList.add('show');
    };
  });


  // Les vidéos officielles restent des fichiers locaux dans videos/. Elles ne sont jamais téléversées.
  // Le chargement ponctuel via le sélecteur reste possible pour tester les fichiers non installés.
  var localVideoStatus = {};
  function placeholder(card,name){
    card.innerHTML='<div class="video-empty"><div class="icon">🎥</div><strong>'+name+'</strong><span>Vidéo non installée. Copiez ce MP4 dans le dossier « videos », puis actualisez la page. Vous pouvez aussi utiliser le bouton « Médias » pour la charger ponctuellement.</span></div>';
  }
  function renderFileStatus(){
    var loaded=videoNames.filter(function(n){return !!videoUrls[n] || localVideoStatus[n]==='ok';}).length;
    document.getElementById('fileSummary').textContent=loaded+' vidéo'+(loaded>1?'s':'')+' sur 6 disponible'+(loaded>1?'s':'')+' localement (copies optimisées).';
    document.getElementById('fileStatus').innerHTML=videoNames.map(function(n){
      var ok=!!videoUrls[n] || localVideoStatus[n]==='ok';
      var mode=videoUrls[n]?' (session)':localVideoStatus[n]==='ok'?' (installée)':localVideoStatus[n]==='checking'?' (vérification…)':' (absente)';
      return '<div class="file-chip '+(ok?'ok':'')+'">'+(ok?'✓ ':'○ ')+n+mode+'</div>';
    }).join('');
  }
  function saveMapping(){localStorage.setItem(mappingKey,JSON.stringify(mapping));}
  function getVideoName(s){return mapping[s.getAttribute('data-title')] || s.getAttribute('data-video');}
  function exportCsvFile(rows,filename){
    var content='\uFEFF'+rows.map(function(r){return r.map(csvField).join(';');}).join('\r\n');
    var blob=new Blob([content],{type:'text/csv;charset=utf-8'});
    var url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
    setTimeout(function(){URL.revokeObjectURL(url);},2000);
  }
  function renderMapping(){
    var container=document.getElementById('mappingSummary');if(!container)return;
    container.textContent='';
    document.querySelectorAll('.gesture-screen').forEach(function(s){
      var row=document.createElement('div');row.className='mapping-row';
      var title=document.createElement('strong');title.textContent=s.getAttribute('data-title');
      var file=document.createElement('span');file.textContent=getVideoName(s);
      row.appendChild(title);row.appendChild(file);container.appendChild(row);
    });
  }
  function initAssociationControls(){
    document.querySelectorAll('.gesture-screen').forEach(function(s){
      var select=s.querySelector('.video-association'); if(!select)return;
      select.textContent='';
      videoNames.forEach(function(n){var opt=document.createElement('option');opt.value=n;opt.textContent=n;select.appendChild(opt);});
      select.value=getVideoName(s);
      var origin=s.querySelector('.video-origin');
      origin.textContent='Fichier CHT : '+getVideoName(s)+' · '+videoValidatedNotice;
      select.addEventListener('change',function(){
        mapping[s.getAttribute('data-title')]=select.value;
        saveMapping();hydrateVideos();renderMapping();
      });
    });
    renderMapping();
  }
  function hydrateVideos(){
    document.querySelectorAll('.gesture-screen').forEach(function(s){
      var name=getVideoName(s), card=s.querySelector('.video-card');
      var sel=s.querySelector('.video-association');if(sel && sel.value!==name)sel.value=name;
      var origin=s.querySelector('.video-origin');if(origin)origin.textContent='Fichier CHT : '+name+' · '+videoValidatedNotice;
      if(!card)return;
      var selectedUrl=videoUrls[name];
      var source=selectedUrl || 'videos/'+encodeURIComponent(name);
      if(card.getAttribute('data-loaded')===source)return;
      // Un échec de vérification ne doit pas supprimer les autres activités.
      card.setAttribute('data-loaded',source);
      card.textContent='';
      var vid=document.createElement('video');
      vid.controls=true;
      vid.playsInline=true;
      vid.preload='metadata';
      vid.src=source;
      vid.setAttribute('aria-label','Démonstration CHT : '+s.getAttribute('data-title'));
      if(!selectedUrl){
        localVideoStatus[name]='checking';
        vid.addEventListener('loadedmetadata',function(){
          if(card.getAttribute('data-loaded')!==source)return;
          localVideoStatus[name]='ok';
          renderFileStatus();
        },{once:true});
        vid.addEventListener('error',function(){
          if(card.getAttribute('data-loaded')!==source)return;
          localVideoStatus[name]='missing';
          placeholder(card,name);
          renderFileStatus();
        },{once:true});
      }
      card.appendChild(vid);
    });
    renderFileStatus();
  }
  initAssociationControls();
  hydrateVideos();
  // v1.4 — quatre temps par geste, interactions formatives sans incidence sur les huit questions finales.
  function setGesturePhase(gesture, phase){
    var panels = Array.prototype.slice.call(gesture.querySelectorAll('.journey-panel'));
    phase = Math.max(0,Math.min(3,Number(phase)||0));
    gesture.querySelectorAll('.journey-tab').forEach(function(tab,i){
      var on=(i===phase);
      tab.setAttribute('aria-selected',String(on));
      tab.setAttribute('tabindex',on?'0':'-1');
    });
    panels.forEach(function(p,i){p.hidden=i!==phase;});
    if(phase!==1){gesture.querySelectorAll('video').forEach(function(v){v.pause();});}
    var end=gesture.querySelector('.journey-completion');
    end.textContent='Étape '+(phase+1)+' sur 4 · '+['Découvrir','Observer','Vigilances','Vérifier'][phase];
  }
  document.querySelectorAll('.gesture-journey').forEach(function(gesture,index){
    var title = gesture.closest('.gesture-screen').getAttribute('data-title');
    var item = microQuestions[index];
    gesture.querySelectorAll('.journey-tab').forEach(function(tab){
      tab.addEventListener('click',function(){setGesturePhase(gesture,tab.getAttribute('data-phase'));});
      tab.addEventListener('keydown',function(e){
        if(e.key!=='ArrowRight' && e.key!=='ArrowLeft')return;
        e.preventDefault();
        var next=(Number(tab.getAttribute('data-phase'))+(e.key==='ArrowRight'?1:3))%4;
        setGesturePhase(gesture,next);
        gesture.querySelectorAll('.journey-tab')[next].focus();
      });
    });
    gesture.querySelectorAll('.journey-next').forEach(function(b){
      b.addEventListener('click',function(){setGesturePhase(gesture,b.getAttribute('data-next-phase'));});
    });
    var feedback=gesture.querySelector('.micro-feedback');
    function paintAnswer(answer){
      var good=answer===item.c;
      gesture.querySelectorAll('.micro-choice').forEach(function(b,i){
        b.disabled=answer!==null;
        b.classList.toggle('chosen',i===answer);
        b.classList.toggle('right',answer!==null && i===item.c);
      });
      feedback.textContent=answer===null?'':(good?'Bonne réponse. ':'À revoir. ')+item.why;
      feedback.classList.toggle('visible',answer!==null);
    }
    gesture.querySelectorAll('.micro-choice').forEach(function(b){
      b.addEventListener('click',function(){
        var answer=Number(b.getAttribute('data-answer'));
        microAnswers[title]=answer;
        localStorage.setItem(microKey,JSON.stringify(microAnswers));
        paintAnswer(answer);
      });
    });
    paintAnswer(Object.prototype.hasOwnProperty.call(microAnswers,title)?microAnswers[title]:null);
    setGesturePhase(gesture,0);
  });

  // Version code seule sur GitHub : remplacent les images absentes par un message explicite.
  document.querySelectorAll('img[src^="images/"]').forEach(function(img){
    img.addEventListener('error',function(){
      var label=document.createElement('span');label.className='media-missing';
      label.setAttribute('role','note');
      label.textContent='Photographie CHT non incluse dans cette version de code — consulter la version locale autorisée.';
      var zoom=img.closest('[data-zoom]');
      if(zoom){zoom.disabled=true;zoom.classList.add('unavailable');zoom.appendChild(label);}
      else{img.replaceWith(label);return;}
      img.remove();
    },{once:true});
  });

  document.getElementById('exportMappingBtn').onclick=function(){
    var rows=[['Écran','Geste','Vidéo proposée dans la v1.1','Vidéo retenue dans ce navigateur','Statut métier']];
    document.querySelectorAll('.gesture-screen').forEach(function(s){
      rows.push([screens.indexOf(s)+1,s.getAttribute('data-title'),s.getAttribute('data-video'),getVideoName(s),'À valider par CHT']);
    });
    exportCsvFile(rows,'correspondance_videos_massage_abdominal_CHT_v1_4.csv');
    document.getElementById('mappingFeedback').textContent='Tableau de correspondance exporté localement.';
  };
  document.getElementById('resetMappingBtn').onclick=function(){
    mapping={};saveMapping();hydrateVideos();renderMapping();
    document.getElementById('mappingFeedback').textContent='Associations proposées par défaut rétablies ; validation métier toujours nécessaire.';
  };
  document.getElementById('videoPicker').onchange=function(e){
    Array.prototype.slice.call(e.target.files||[]).forEach(function(file){
      if(videoNames.indexOf(file.name)>=0 && (file.type==='video/mp4'||file.type==='')){
        if(videoUrls[file.name])URL.revokeObjectURL(videoUrls[file.name]);
        videoUrls[file.name]=URL.createObjectURL(file);
      }
    });
    hydrateVideos();
  };

  function persistQuiz(){localStorage.setItem(quizKey,JSON.stringify({score:quizScore,answers:quizAnswered,index:quizIndex,done:quizIndex>=quiz.length}));}
  function renderQuiz(){
    var dots=document.getElementById('quizDots');
    dots.innerHTML=quiz.map(function(_,i){return '<span class="dot '+(quizAnswered[i]!==undefined?'done':'')+'">'+(i+1)+'</span>';}).join('');
    var c=document.getElementById('quizContent');
    if(quizIndex>=quiz.length){
      var pct=Math.round((quizScore/quiz.length)*100);
      c.innerHTML='<div class="score">'+quizScore+' / '+quiz.length+'</div><h3>'+pct+' %</h3><p>Les questions portent uniquement sur les éléments non litigieux de cette version.</p><button class="btn btn-primary" id="quizToEnd">Voir la synthèse</button>';
      document.getElementById('finalScore').textContent=quizScore+' / '+quiz.length;
      document.getElementById('finalScoreText').textContent='Score obtenu sur les 8 décisions évaluées de la version de validation 1.4.';
      persistQuiz();
      setTimeout(function(){var b=document.getElementById('quizToEnd');if(b)b.onclick=function(){show(22);};},0);
      return;
    }
    var item=quiz[quizIndex];
    c.innerHTML='<div class="kicker">Décision '+(quizIndex+1)+' / '+quiz.length+'</div><h3 style="font-size:25px">'+item.q+'</h3><div class="choice-grid">'+item.a.map(function(a,i){return '<button class="choice quiz-choice" data-a="'+i+'"><strong>'+(String.fromCharCode(65+i))+'.</strong><span>'+a+'</span></button>';}).join('')+'</div><div class="feedback" id="quizFb"></div>';
    c.querySelectorAll('.quiz-choice').forEach(function(b){
      b.onclick=function(){
        if(quizAnswered[quizIndex]!==undefined)return;
        var a=Number(b.getAttribute('data-a')),good=a===item.c;
        quizAnswered[quizIndex]=a;if(good)quizScore++;persistQuiz();
        b.classList.add(good?'correct':'wrong');
        var fb=document.getElementById('quizFb');fb.innerHTML=good?'<strong>Bonne décision.</strong>':'<strong>À revoir.</strong> La réponse attendue est : '+item.a[item.c]+'.';fb.classList.add('show');
        setTimeout(function(){quizIndex++;persistQuiz();renderQuiz();},650);
      };
    });
  }
  var savedQuiz=localStorage.getItem(quizKey);
  if(savedQuiz){
    try{
      var sq=JSON.parse(savedQuiz);
      if(Array.isArray(sq.answers)){
        quizAnswered=sq.answers.slice(0,quiz.length);
        quizScore=quiz.reduce(function(n,q,i){return n+(quizAnswered[i]===q.c?1:0);},0);
        quizIndex=quizAnswered.length;
      }
      if(quizIndex===quiz.length){
        document.getElementById('finalScore').textContent=quizScore+' / '+quiz.length;
        document.getElementById('finalScoreText').textContent='Score enregistré localement.';
      }
    }catch(e){}
  }


  document.getElementById('restartBtn').onclick=function(){quizIndex=0;quizScore=0;quizAnswered=[];localStorage.removeItem(quizKey);microAnswers={};localStorage.removeItem(microKey);document.querySelectorAll('.gesture-journey').forEach(function(g){g.querySelectorAll('.micro-choice').forEach(function(b){b.disabled=false;b.classList.remove('chosen','right');});var f=g.querySelector('.micro-feedback');f.classList.remove('visible');f.textContent='';setGesturePhase(g,0);});show(0);};
  document.getElementById('clearProgressBtn').onclick=function(){localStorage.removeItem(key);localStorage.removeItem(quizKey);localStorage.removeItem(microKey);microAnswers={};quizIndex=0;quizScore=0;quizAnswered=[];alert('Progression locale effacée.');show(0);};


  function toggleFs(){
    if(!document.fullscreenElement){document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();}
    else{document.exitFullscreen&&document.exitFullscreen();}
  }
  document.getElementById('fsBtn').onclick=toggleFs;
  document.addEventListener('fullscreenchange',function(){
    var fs=!!document.fullscreenElement,b=document.getElementById('fsBtn');
    b.setAttribute('aria-pressed',String(fs));
    b.setAttribute('aria-label',fs?'Quitter le plein écran':'Passer en plein écran');
    b.title=fs?'Quitter le plein écran':'Passer en plein écran';
  });


  var menuOverlay=document.getElementById('menuOverlay'),mediaOverlay=document.getElementById('mediaOverlay'),reviewOverlay=document.getElementById('reviewOverlay');
  var photoOverlay=document.getElementById('photoOverlay');
  document.getElementById('openMenu').onclick=function(){menuOverlay.classList.add('show');};
  document.getElementById('mediaBtn').onclick=function(){mediaOverlay.classList.add('show');mediaOverlay.setAttribute('aria-hidden','false');};
  document.getElementById('reviewBtn').onclick=openReview;
  document.getElementById('introReviewBtn').onclick=openReview;
  document.querySelectorAll('.closeOverlay').forEach(function(b){b.onclick=closeOverlays;});
  document.querySelectorAll('.overlay').forEach(function(o){o.addEventListener('click',function(e){if(e.target===o)closeOverlays();});});
  function closeOverlays(){menuOverlay.classList.remove('show');mediaOverlay.classList.remove('show');reviewOverlay.classList.remove('show');photoOverlay.classList.remove('show');reviewOverlay.setAttribute('aria-hidden','true');mediaOverlay.setAttribute('aria-hidden','true');photoOverlay.setAttribute('aria-hidden','true');document.getElementById('photoLightboxImage').removeAttribute('src');}
  document.querySelectorAll('[data-zoom]').forEach(function(b){b.addEventListener('click',function(){var img=document.getElementById('photoLightboxImage');img.src=b.getAttribute('data-zoom');img.alt=b.querySelector('img')?.alt || 'Photographie source CHT';document.getElementById('photoCaption').textContent=b.getAttribute('data-caption')||'';photoOverlay.classList.add('show');photoOverlay.setAttribute('aria-hidden','false');});});


  document.addEventListener('keydown',function(e){
    if(!e.target.closest('input, textarea, select') && !document.querySelector('.overlay.show')){
      if(e.key==='ArrowRight' && current<screens.length-1)show(current+1);
      if(e.key==='ArrowLeft' && current>0)show(current-1);
    }
    if(e.key==='Escape')closeOverlays();
  });




  // Annotations de validation. Stockage local uniquement, sans service externe.
  var reviews={};
  try{reviews=JSON.parse(localStorage.getItem(reviewKey)||'{}')||{};}catch(e){reviews={};}
  function getReview(){return reviews[String(current)]||{};}
  function markReviews(){
    document.querySelectorAll('.nav button[data-goto]').forEach(function(b){
      var i=b.getAttribute('data-goto');
      b.classList.toggle('has-review',!!(reviews[i]&&(reviews[i].status||reviews[i].comment)));
    });
  }
  function openReview(){
    var r=getReview();
    document.getElementById('reviewScreenLabel').textContent='Écran '+(current+1)+' / '+screens.length+' — '+titles[current];
    document.getElementById('reviewStatus').value=r.status||'';
    document.getElementById('reviewComment').value=r.comment||'';
    document.getElementById('reviewSaveStatus').textContent='';
    reviewOverlay.classList.add('show');reviewOverlay.setAttribute('aria-hidden','false');
    document.getElementById('reviewStatus').focus();
  }
  document.getElementById('saveReviewBtn').onclick=function(){
    var status=document.getElementById('reviewStatus').value;
    var comment=document.getElementById('reviewComment').value.trim();
    if(status||comment){reviews[String(current)]={status:status,comment:comment,screen:titles[current]};}
    else{delete reviews[String(current)];}
    localStorage.setItem(reviewKey,JSON.stringify(reviews));markReviews();
    document.getElementById('reviewSaveStatus').textContent='Avis enregistré dans ce navigateur, pour cet écran.';
  };
  document.getElementById('deleteReviewBtn').onclick=function(){
    delete reviews[String(current)];localStorage.setItem(reviewKey,JSON.stringify(reviews));
    document.getElementById('reviewStatus').value='';document.getElementById('reviewComment').value='';
    document.getElementById('reviewSaveStatus').textContent='Avis effacé pour cet écran.';markReviews();
  };
  function csvField(v){
    var s=String(v==null?'':v).replace(/^[\s]*([=+@-])/,"'$&");
    return '"'+s.replace(/"/g,'""')+'"';
  }
  document.getElementById('exportReviewsBtn').onclick=function(){
    var rows=[['Écran','Titre','Statut','Commentaire']];
    Object.keys(reviews).sort(function(a,b){return Number(a)-Number(b);}).forEach(function(k){
      var r=reviews[k];if(r.status||r.comment)rows.push([Number(k)+1,titles[Number(k)]||r.screen,r.status||'',r.comment||'']);
    });
    var content='\uFEFF'+rows.map(function(r){return r.map(csvField).join(';');}).join('\r\n');
    var blob=new Blob([content],{type:'text/csv;charset=utf-8'});
    var url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='validation_massage_abdominal_CHT_v1_4.csv';
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(function(){URL.revokeObjectURL(url);},2000);
    document.getElementById('reviewSaveStatus').textContent=rows.length-1+' avis exporté(s) dans un fichier CSV local.';
  };
  markReviews();
  window.addEventListener('beforeunload',function(){
    Object.keys(videoUrls).forEach(function(k){URL.revokeObjectURL(videoUrls[k]);});
  });

  show(0,false);
})();