/**
 * tracking.js - Augmented Reality JavaScript Framework.
 * @author Eduardo Lundgren <edu@rdo.io>
 * @version v1.0.0-alpha
 * @link http://trackingjs.com
 * @license BSD
 */
!function(r){r.tracking=r.tracking||{},tracking.forEach=function(r,t,a){var n;if(Array.isArray(r))r.forEach(function(){t.apply(a,arguments)});else for(n in r)r.hasOwnProperty(n)&&t.call(a,r[n],n,r);return r},tracking.inherits=function(r,t){function a(){}a.prototype=t.prototype,r.superClass_=t.prototype,r.prototype=new a,r.prototype.constructor=r,r.base=function(r,a){var n=Array.prototype.slice.call(arguments,2);return t.prototype[a].apply(r,n)}},tracking.initUserMedia_=function(t,a){r.navigator.getUserMedia({video:!0,audio:a.audio},function(a){try{t.src=r.URL.createObjectURL(a)}catch(n){t.src=a}},function(){throw Error("Cannot capture user camera.")})},tracking.isNode=function(r){return r.nodeType||this.isWindow(r)},tracking.isWindow=function(r){return!!(r&&r.alert&&r.document)},tracking.merge=function(r,t){for(var a in t)r[a]=t[a];return r},tracking.one=function(r,t){return this.isNode(r)?r:(t||document).querySelector(r)},tracking.track=function(r,t,a){if(r=tracking.one(r),!r)throw new Error("Element not found, try a different element or selector.");if(!t)throw new Error("Tracker not specified, try `tracking.track(element, new tracking.FaceTracker())`.");switch(r.nodeName.toLowerCase()){case"canvas":return this.trackCanvas_(r,t,a);case"img":return this.trackImg_(r,t,a);case"video":return a&&a.camera&&this.initUserMedia_(r,a),this.trackVideo_(r,t,a);default:throw new Error("Element not supported, try in a canvas, img, or video.")}},tracking.trackCanvas_=function(r,t){var a=r.width,n=r.height,o=r.getContext("2d"),e=o.getImageData(0,0,a,n);t.track(e.data,a,n)},tracking.trackImg_=function(r,t){var a=r.width,n=r.height,o=document.createElement("canvas");o.width=a,o.height=n,tracking.Canvas.loadImage(o,r.src,0,0,a,n,function(){tracking.trackCanvas_(o,t)})},tracking.trackVideo_=function(t,a){var n,o,e=document.createElement("canvas"),i=e.getContext("2d"),c=function(){n=t.offsetWidth,o=t.offsetHeight,e.width=n,e.height=o};c(),t.addEventListener("resize",c);var s=function(){r.requestAnimationFrame(function(){if(t.readyState===t.HAVE_ENOUGH_DATA){try{i.drawImage(t,0,0,n,o)}catch(r){}tracking.trackCanvas_(e,a)}s()})};s()},r.URL||(r.URL=r.URL||r.webkitURL||r.msURL||r.oURL),navigator.getUserMedia||(navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia)}(window),function(){tracking.Brief={},tracking.Brief.N=128,tracking.Brief.randomOffsets_={},tracking.Brief.getDescriptors=function(r,t,a){for(var n=new Int32Array(a.length*(this.N>>5)),o=0,e=this.getRandomOffsets_(t),i=0,c=0;c<a.length;c+=2)for(var s=t*a[c+1]+a[c],f=0,u=this.N;u>f;f++)r[e[f+f]+s]<r[e[f+f+1]+s]&&(o|=1<<(31&f)),f+1&31||(n[i++]=o,o=0);return n},tracking.Brief.match=function(r,t,a,n){for(var o=r.length>>1,e=a.length>>1,i=new Int32Array(o),c=0;o>c;c++){for(var s=1/0,f=0,u=0;e>u;u++){for(var g=0,l=0,h=this.N>>5;h>l;l++)g+=tracking.Math.hammingWeight(t[c*h+l]^n[u*h+l]);s>g&&(s=g,f=u)}i[c]=f}return i},tracking.Brief.getRandomOffsets_=function(r){if(this.randomOffsets_[r])return this.randomOffsets_[r];for(var t=new Int32Array(2*this.N),a=0,n=0;n<this.N;n++)t[a++]=tracking.Math.uniformRandom(-15,16)*r+tracking.Math.uniformRandom(-15,16),t[a++]=tracking.Math.uniformRandom(-15,16)*r+tracking.Math.uniformRandom(-15,16);return this.randomOffsets_[r]=t,this.randomOffsets_[r]}}(),function(){tracking.Canvas={},tracking.Canvas.loadImage=function(r,t,a,n,o,e,i){var c=this,s=new window.Image;s.onload=function(){var t=r.getContext("2d");r.width=o,r.height=e,t.drawImage(s,a,n,o,e),i&&i.call(c),s=null},s.src=t}}(),function(){tracking.EPnP=function(){},tracking.EPnP.prototype.initPoints=function(r,t){for(var a=this,n=a.numberOfCorrespondences,o=a.pws,e=a.us,i=0;n>i;i++)o[3*i]=r[i].x,o[3*i+1]=r[i].y,o[3*i+2]=r[i].z,e[2*i]=t[i].x*a.fu+a.uc,e[2*i+1]=t[i].y*a.fv+a.vc},tracking.EPnP.prototype.initCameraParameters=function(r){var t=this;t.uc=r[2],t.vc=r[5],t.fu=r[0],t.fv=r[4]},tracking.EPnP.prototype.init=function(r,t,a){var n=this,o=r.length;n.initCameraParameters(a),n.numberOfCorrespondences=o,n.pws=new Float64Array(3*o),n.us=new Float64Array(2*o),n.initPoints(r,t),n.alphas=new Float64Array(4*o),n.pcs=new Float64Array(3*o),n.max_nr=0},tracking.EPnP.prototype.svd=function(r,t,a,n,o,e){var i,c,s=[];for(i=0;t>i;i++)for(s.push([]),c=0;a>c;c++)s[i].push(r[i*a+c]);var f=numeric.svd(s),u=f.S,g=f.U,l=f.V;if(n)for(i=0;i<u.length;i++)n[i]=u[i];if(o)for(i=0;t>i;i++)for(c=0;t>c;c++)o[i*t+c]=g[i][c];if(e)for(i=0;a>i;i++)for(c=0;a>c;c++)e[i*a+c]=l[i][c]},tracking.EPnP.prototype.invertSquare=function(r,t,a){var n,o,e=[];for(n=0;t>n;n++)for(e.push([]),o=0;t>o;o++)e[n].push(r[n*t+o]);for(e=numeric.inv(e),n=0;t>n;n++)for(o=0;t>o;o++)a[n*t+o]=e[n][o]},tracking.EPnP.prototype.transpose=function(r,t,a,n){var o,e;for(o=0;t>o;o++)for(e=0;a>e;e++)n[e*t+o]=r[o*a+e]},tracking.EPnP.prototype.multiply=function(r,t,a,n,o,e){var i,c,s;for(i=0;a>i;i++)for(c=0;o>c;c++)for(e[i*o+c]=0,s=0;n>s;s++)e[i*o+c]+=r[i*n+s]*t[s*o+c]},tracking.EPnP.prototype.transposeSquare=function(r,t){var a,n,o;for(a=1;t>a;a++)for(n=0;a>n;n++)o=r[a*t+n],r[a*t+n]=r[n*t+a],r[n*t+a]=o},tracking.EPnP.prototype.mulTransposed=function(r,t,a,n,o){var e,i,c;if(o)for(e=0;a>e;e++)for(i=0;a>i;i++)for(n[e*a+i]=0,c=0;t>c;c++)n[e*a+i]+=r[c*a+e]*r[c*a+i];else for(e=0;t>e;e++)for(i=0;t>i;i++)for(n[e*a+i]=0,c=0;a>c;c++)n[e*a+i]+=r[e*a+c]*r[i*a+c]},tracking.EPnP.prototype.solveLinearSystem=function(r,t,a,n,o){var e,i,c=[],s=[],f=new Float64Array(a*t),u=new Float64Array(a*a),g=new Float64Array(a);for(this.transpose(r,t,a,f),this.multiply(f,r,a,t,a,u),this.multiply(f,n,a,t,1,g),e=0;a>e;e++){for(c.push([]),i=0;a>i;i++)c[e].push(u[e*a+i]);s.push(g[e])}var l=numeric.solve(c,s);for(e=0;a>e;e++)o[e]=l[e]},tracking.EPnP.prototype.chooseControlPoints=function(){var r,t,a=this,n=new Float64Array(12),o=a.numberOfCorrespondences,e=a.pws;for(a.cws=n,n[0]=n[1]=n[2]=0,r=0;o>r;r++)for(t=0;3>t;t++)n[0+t]+=e[3*r+t];for(t=0;3>t;t++)n[0+t]/=o;var i=new Float64Array(3*o),c=new Float64Array(9),s=new Float64Array(3),f=new Float64Array(9);for(r=0;o>r;r++)for(t=0;3>t;t++)i[3*r+t]=e[3*r+t]-n[0+t];for(a.mulTransposed(i,o,3,c,1),a.svd(c,3,3,s,f,0),a.transposeSquare(f,3),r=1;4>r;r++){var u=Math.sqrt(s[r-1]/o);for(t=0;3>t;t++)n[3*r+t]=n[0+t]+u*f[3*(r-1)+t]}},tracking.EPnP.prototype.computeBarycentricCoordinates=function(){var r,t,a=this,n=a.alphas,o=new Float64Array(9),e=new Float64Array(9),i=a.cws,c=a.pws;for(r=0;3>r;r++)for(t=1;4>t;t++)o[3*r+t-1]=i[3*t+r]-i[0+r];for(a.invertSquare(o,3,e),r=0;r<a.numberOfCorrespondences;r++){var s=3*r,f=4*r;for(t=0;3>t;t++)n[f+1+t]=e[3*t]*(c[s+0]-i[0])+e[3*t+1]*(c[s+1]-i[1])+e[3*t+2]*(c[s+2]-i[2]);n[f+0]=1-n[f+1]-n[f+2]-n[f+3]}},tracking.EPnP.prototype.fillM=function(r,t,a,n,o,e){for(var i=this,c=i.fu,s=i.fv,f=i.uc,u=i.vc,g=12*t,l=g+12,h=0;4>h;h++)r[g+3*h]=a[n+h]*c,r[g+3*h+1]=0,r[g+3*h+2]=a[n+h]*(f-o),r[l+3*h]=0,r[l+3*h+1]=a[n+h]*s,r[l+3*h+2]=a[n+h]*(u-e)},tracking.EPnP.prototype.computeCCS=function(r,t){var a,n,o,e=this,i=new Float64Array(12);for(e.ccs=i,a=0;4>a;a++)i[3*a]=i[3*a+1]=i[3*a+2]=0;for(a=0;4>a;a++){var c=12*(11-a);for(n=0;4>n;n++)for(o=0;3>o;o++)i[3*n+o]+=r[a]*t[c+3*n+o]}},tracking.EPnP.prototype.computePCS=function(){var r,t,a=this,n=a.alphas,o=a.ccs,e=new Float64Array(3*a.numberOfCorrespondences);for(a.pcs=e,r=0;r<a.numberOfCorrespondences;r++){var i=4*r,c=3*r;for(t=0;3>t;t++)e[c+t]=n[i+0]*o[0+t]+n[i+1]*o[3+t]+n[i+2]*o[6+t]+n[i+3]*o[9+t]}},tracking.EPnP.prototype.computePose=function(r,t){var a,n=this,o=n.numberOfCorrespondences,e=n.alphas,i=n.us;n.chooseControlPoints(),n.computeBarycentricCoordinates();var c=new Float64Array(2*o*12);for(a=0;o>a;a++)n.fillM(c,2*a,e,4*a,i[2*a],i[2*a+1]);var s=new Float64Array(144),f=new Float64Array(12),u=new Float64Array(144);n.mulTransposed(c,2*o,12,s,1),n.svd(s,12,12,f,u,0),n.transposeSquare(u,12);var g=new Float64Array(60),l=new Float64Array(6);n.computeL6x10(u,g),n.computeRho(l);var h=[new Float64Array(4),new Float64Array(4),new Float64Array(4),new Float64Array(4)],k=new Float64Array(4),p=[new Float64Array(9),new Float64Array(9),new Float64Array(9),new Float64Array(9)],y=[new Float64Array(3),new Float64Array(3),new Float64Array(3),new Float64Array(3)];n.findBetasApprox1(g,l,h[1]),n.gaussNewton(g,l,h[1]),k[1]=n.computeRAndT(u,h[1],p[1],y[1]),n.findBetasApprox2(g,l,h[2]),n.gaussNewton(g,l,h[2]),k[2]=n.computeRAndT(u,h[2],p[2],y[2]),n.findBetasApprox3(g,l,h[3]),n.gaussNewton(g,l,h[3]),k[3]=n.computeRAndT(u,h[3],p[3],y[3]);var v=1;k[2]<k[1]&&(v=2),k[3]<k[v]&&(v=3),n.copyRAndT(p[v],y[v],r,t)},tracking.EPnP.prototype.copyRAndT=function(r,t,a,n){var o,e;for(o=0;3>o;o++){for(e=0;3>e;e++)a[3*o+e]=r[3*o+e];n[o]=t[o]}},tracking.EPnP.prototype.dist2=function(r,t,a,n){return(r[t+0]-a[n+0])*(r[t+0]-a[n+0])+(r[t+1]-a[n+1])*(r[t+1]-a[n+1])+(r[t+2]-a[n+2])*(r[t+2]-a[n+2])},tracking.EPnP.prototype.dot=function(r,t,a,n){return r[t+0]*a[n+0]+r[t+1]*a[n+1]+r[t+2]*a[n+2]},tracking.EPnP.prototype.estimateRAndT=function(r,t){var a,n,o,e,i=this,c=i.numberOfCorrespondences,s=new Float64Array(3),f=i.pcs,u=new Float64Array(3),g=i.pws;for(s[0]=s[1]=s[2]=0,u[0]=u[1]=u[2]=0,a=0;c>a;a++)for(o=3*a,e=3*a,n=0;3>n;n++)s[n]+=f[o+n],u[n]+=g[e+n];for(n=0;3>n;n++)s[n]/=c,u[n]/=c;var l=new Float64Array(9),h=new Float64Array(3),k=new Float64Array(9),p=new Float64Array(9);for(a=0;9>a;a++)l[a]=0;for(a=0;c>a;a++)for(o=3*a,e=3*a,n=0;3>n;n++)l[3*n]+=(f[o+n]-s[n])*(g[e+0]-u[0]),l[3*n+1]+=(f[o+n]-s[n])*(g[e+1]-u[1]),l[3*n+2]+=(f[o+n]-s[n])*(g[e+2]-u[2]);for(i.svd(l,3,3,h,k,p),a=0;3>a;a++)for(n=0;3>n;n++)r[3*a+n]=i.dot(k,3*a,p,3*n);var y=r[0]*r[4]*r[8]+r[1]*r[5]*r[6]+r[2]*r[3]*r[7]-r[2]*r[4]*r[6]-r[1]*r[3]*r[8]-r[0]*r[5]*r[7];0>y&&(r[6]=-r[6],r[7]=-r[7],r[8]=-r[8]),t[0]=s[0]-i.dot(r,0,u,0),t[1]=s[1]-i.dot(r,3,u,0),t[2]=s[2]-i.dot(r,6,u,0)},tracking.EPnP.prototype.solveForSign=function(){var r,t,a=this,n=a.pcs,o=a.ccs;if(n[2]<0){for(r=0;4>r;r++)for(t=0;3>t;t++)o[3*r+t]=-o[3*r+t];for(r=0;r<a.numberOfCorrespondences;r++)n[3*r]=-n[3*r],n[3*r+1]=-n[3*r+1],n[3*r+2]=-n[3*r+2]}},tracking.EPnP.prototype.computeRAndT=function(r,t,a,n){var o=this;return o.computeCCS(t,r),o.computePCS(),o.solveForSign(),o.estimateRAndT(a,n),o.reprojectionError(a,n)},tracking.EPnP.prototype.reprojectionError=function(r,t){var a,n=this,o=n.pws,e=n.dot,i=n.us,c=n.uc,s=n.vc,f=n.fu,u=n.fv,g=0;for(a=0;a<n.numberOfCorrespondences;a++){var l=3*a,h=e(r,0,o,l)+t[0],k=e(r,3,o,l)+t[1],p=1/(e(r,6,o,l)+t[2]),y=c+f*h*p,v=s+u*k*p,d=i[2*a],A=i[2*a+1];g+=Math.sqrt((d-y)*(d-y)+(A-v)*(A-v))}return g/n.numberOfCorrespondences},tracking.EPnP.prototype.findBetasApprox1=function(r,t,a){var n,o=new Float64Array(24),e=new Float64Array(4);for(n=0;6>n;n++)o[4*n+0]=r[10*n+0],o[4*n+1]=r[10*n+1],o[4*n+2]=r[10*n+3],o[4*n+3]=r[10*n+6];this.solveLinearSystem(o,6,4,t,e),e[0]<0?(a[0]=Math.sqrt(-e[0]),a[1]=-e[1]/a[0],a[2]=-e[2]/a[0],a[3]=-e[3]/a[0]):(a[0]=Math.sqrt(e[0]),a[1]=e[1]/a[0],a[2]=e[2]/a[0],a[3]=e[3]/a[0])},tracking.EPnP.prototype.findBetasApprox2=function(r,t,a){var n,o=new Float64Array(18),e=new Float64Array(3);for(n=0;6>n;n++)o[3*n+0]=r[10*n+0],o[3*n+1]=r[10*n+1],o[3*n+2]=r[10*n+2];this.solveLinearSystem(o,6,3,t,e),e[0]<0?(a[0]=Math.sqrt(-e[0]),a[1]=e[2]<0?Math.sqrt(-e[2]):0):(a[0]=Math.sqrt(e[0]),a[1]=e[2]>0?Math.sqrt(e[2]):0),e[1]<0&&(a[0]=-a[0]),a[2]=0,a[3]=0},tracking.EPnP.prototype.findBetasApprox3=function(r,t,a){var n,o=new Float64Array(30),e=new Float64Array(5);for(n=0;6>n;n++)o[5*n+0]=r[10*n+0],o[5*n+1]=r[10*n+1],o[5*n+2]=r[10*n+2],o[5*n+3]=r[10*n+3],o[5*n+4]=r[10*n+4];this.solveLinearSystem(o,6,5,t,e),e[0]<0?(a[0]=Math.sqrt(-e[0]),a[1]=e[2]<0?Math.sqrt(-e[2]):0):(a[0]=Math.sqrt(e[0]),a[1]=e[2]>0?Math.sqrt(e[2]):0),e[1]<0&&(a[0]=-a[0]),a[2]=e[3]/a[0],a[3]=0},tracking.EPnP.prototype.computeL6x10=function(r,t){var a,n,o=this,e=new Uint8ClampedArray(4);e[0]=132,e[1]=120,e[2]=108,e[3]=96;var i=[new Float64Array(18),new Float64Array(18),new Float64Array(18),new Float64Array(18)];for(a=0;4>a;a++){var c=0,s=1;for(n=0;6>n;n++)i[a][3*n+0]=r[e[a]+3*c]-r[e[a]+3*s],i[a][3*n+1]=r[e[a]+3*c+1]-r[e[a]+3*s+1],i[a][3*n+2]=r[e[a]+3*c+2]-r[e[a]+3*s+2],s++,s>3&&(c++,s=c+1)}for(a=0;6>a;a++)t[10*a+0]=o.dot(i[0],3*a,i[0],3*a),t[10*a+1]=2*o.dot(i[0],3*a,i[1],3*a),t[10*a+2]=o.dot(i[1],3*a,i[1],3*a),t[10*a+3]=2*o.dot(i[0],3*a,i[2],3*a),t[10*a+4]=2*o.dot(i[1],3*a,i[2],3*a),t[10*a+5]=o.dot(i[2],3*a,i[2],3*a),t[10*a+6]=2*o.dot(i[0],3*a,i[3],3*a),t[10*a+7]=2*o.dot(i[1],3*a,i[3],3*a),t[10*a+8]=2*o.dot(i[2],3*a,i[3],3*a),t[10*a+9]=o.dot(i[3],3*a,i[3],3*a)},tracking.EPnP.prototype.computeRho=function(r){var t=this,a=t.cws;r[0]=t.dist2(a,0,a,3),r[1]=t.dist2(a,0,a,6),r[2]=t.dist2(a,0,a,9),r[3]=t.dist2(a,3,a,6),r[4]=t.dist2(a,3,a,9),r[5]=t.dist2(a,6,a,9)},tracking.EPnP.prototype.computeAAndBGaussNewton=function(r,t,a,n,o){var e;for(e=0;6>e;e++){var i=r.subarray(10*e),c=n.subarray(4*e);c[0]=2*i[0]*a[0]+i[1]*a[1]+i[3]*a[2]+i[6]*a[3],c[1]=i[1]*a[0]+2*i[2]*a[1]+i[4]*a[2]+i[7]*a[3],c[2]=i[3]*a[0]+i[4]*a[1]+2*i[5]*a[2]+i[8]*a[3],c[3]=i[6]*a[0]+i[7]*a[1]+i[8]*a[2]+2*i[9]*a[3],o[1*e+0]=t[e]-(i[0]*a[0]*a[0]+i[1]*a[0]*a[1]+i[2]*a[1]*a[1]+i[3]*a[0]*a[2]+i[4]*a[1]*a[2]+i[5]*a[2]*a[2]+i[6]*a[0]*a[3]+i[7]*a[1]*a[3]+i[8]*a[2]*a[3]+i[9]*a[3]*a[3])}},tracking.EPnP.prototype.gaussNewton=function(r,t,a){for(var n=5,o=new Float64Array(24),e=new Float64Array(6),i=new Float64Array(4),c=0;n>c;c++){this.computeAAndBGaussNewton(r,t,a,o,e),this.qr_solve(o,6,4,e,i);for(var s=0;4>s;s++)a[s]+=i[s]}},tracking.EPnP.prototype.qr_solve=function(r,t,a,n,o){var e,i,c,s,f,u,g=this,l=t,h=a;g.max_nr<l&&(g.max_nr=l,g.A1=new Float64Array(l),g.A2=new Float64Array(l));var k=g.A1,p=g.A2,y=r,v=y;for(c=0;h>c;c++){var d=v,A=Math.abs(d[0]);for(e=c+1;l>e;e++){var m=Math.abs(d[0]);m>A&&(A=m),d=d.subarray(h)}if(0===A)return void(k[c]=p[c]=0);var w=v,T=0,F=1/A;for(e=c;l>e;e++)w[0]*=F,T+=w[0]*w[0],w=w.subarray(h);var P=Math.sqrt(T);for(v[0]<0&&(P=-P),v[0]+=P,k[c]=P*v[0],p[c]=-A*P,i=c+1;h>i;i++){var C=v;for(f=0,e=c;l>e;e++)f+=C[0]*C[i-c],C=C.subarray(h);for(u=f/k[c],C=v,e=c;l>e;e++)C[i-c]-=u*C[0],C=C.subarray(h)}v=v.subarray(h+1)}var E=y,M=n;for(i=0;h>i;i++){for(s=E,u=0,e=i;l>e;e++)u+=s[0]*M[e],s=s.subarray(h);for(u/=k[i],s=E,e=i;l>e;e++)M[e]-=u*s[0],s=s.subarray(h);E=E.subarray(h+1)}var R=o;for(R[h-1]=M[h-1]/p[h-1],e=h-2;e>=0;e--){for(s=y.subarray(e*h+(e+1)),f=0,i=e+1;h>i;i++)f+=s[0]*R[i],s=s.subarray(1);R[e]=(M[e]-f)/p[e]}},tracking.EPnP.solve=function(r,t,a){var n=new Float64Array(9),o=new Float64Array(3),e=new tracking.EPnP;return e.init(r,t,a),e.computePose(n,o),{R:n,t:o}}}(),function(){tracking.ViolaJones={},tracking.ViolaJones.REGIONS_OVERLAP=.5,tracking.ViolaJones.detect=function(r,t,a,n,o,e,i,c){var s,f=0,u=[],g=new Int32Array(t*a),l=new Int32Array(t*a),h=new Int32Array(t*a);i>0&&(s=new Int32Array(t*a)),tracking.Image.computeIntegralImage(r,t,a,g,l,h,s);for(var k=c[0],p=c[1],y=n*o,v=y*k|0,d=y*p|0;t>v&&a>d;){for(var A=y*e+.5|0,m=0;a-d>m;m+=A)for(var w=0;t-v>w;w+=A)i>0&&this.isTriviallyExcluded(i,s,m,w,t,v,d)||this.evalStages_(c,g,l,h,m,w,t,v,d,y)&&(u[f++]={width:v,height:d,x:w,y:m});y*=o,v=y*k|0,d=y*p|0}return this.mergeRectangles_(u)},tracking.ViolaJones.isTriviallyExcluded=function(r,t,a,n,o,e,i){var c=a*o+n,s=c+e,f=c+i*o,u=f+e,g=(t[c]-t[s]-t[f]+t[u])/(e*i*255);return r>g?!0:!1},tracking.ViolaJones.evalStages_=function(r,t,a,n,o,e,i,c,s,f){var u=1/(c*s),g=o*i+e,l=g+c,h=g+s*i,k=h+c,p=(t[g]-t[l]-t[h]+t[k])*u,y=(a[g]-a[l]-a[h]+a[k])*u-p*p,v=1;y>0&&(v=Math.sqrt(y));for(var d=r.length,A=2;d>A;){for(var m=0,w=r[A++],T=r[A++];T--;){for(var F=0,P=r[A++],C=r[A++],E=0;C>E;E++){var M,R,S,x,_=e+r[A++]*f+.5|0,b=o+r[A++]*f+.5|0,I=r[A++]*f+.5|0,H=r[A++]*f+.5|0,O=r[A++];P?(M=_-H+I+(b+I+H-1)*i,R=_+(b-1)*i,S=_-H+(b+H-1)*i,x=_+I+(b+I-1)*i,F+=(n[M]+n[R]-n[S]-n[x])*O):(M=b*i+_,R=M+I,S=M+H*i,x=S+I,F+=(t[M]-t[R]-t[S]+t[x])*O)}var D=r[A++],q=r[A++],N=r[A++];m+=D*v>F*u?q:N}if(w>m)return!1}return!0},tracking.ViolaJones.mergeRectangles_=function(r){for(var t=new tracking.DisjointSet(r.length),a=0;a<r.length;a++)for(var n=r[a],o=0;o<r.length;o++){var e=r[o];if(tracking.Math.intersectRect(n.x,n.y,n.x+n.width,n.y+n.height,e.x,e.y,e.x+e.width,e.y+e.height)){var i=Math.max(n.x,e.x),c=Math.max(n.y,e.y),s=Math.min(n.x+n.width,e.x+e.width),f=Math.min(n.y+n.height,e.y+e.height),u=(i-s)*(c-f),g=n.width*n.height,l=e.width*e.height;u/(g*(g/l))>=this.REGIONS_OVERLAP&&u/(l*(g/l))>=this.REGIONS_OVERLAP&&t.union(a,o)}}for(var h={},k=0;k<t.length;k++){var p=t.find(k);h[p]?(h[p].total++,h[p].width+=r[k].width,h[p].height+=r[k].height,h[p].x+=r[k].x,h[p].y+=r[k].y):h[p]={total:1,width:r[k].width,height:r[k].height,x:r[k].x,y:r[k].y}}var y=[];return Object.keys(h).forEach(function(r){var t=h[r];y.push({total:t.total,width:t.width/t.total+.5|0,height:t.height/t.total+.5|0,x:t.x/t.total+.5|0,y:t.y/t.total+.5|0})}),y}}(),function(){tracking.Fast={},tracking.Fast.FAST_THRESHOLD=40,tracking.Fast.circles_={},tracking.Fast.findCorners=function(r,t,a){for(var n=this.getCircleOffsets_(t),o=new Int32Array(16),e=[],i=3;a-3>i;i++)for(var c=3;t-3>c;c++){for(var s=i*t+c,f=r[s],u=0;16>u;u++)o[u]=r[s+n[u]];this.isCorner(f,o,this.FAST_THRESHOLD)&&(e.push(c,i),c+=3)}return e},tracking.Fast.isBrighter=function(r,t,a){return r-t>a},tracking.Fast.isCorner=function(r,t,a){if(this.isTriviallyExcluded(t,r,a))return!1;for(var n=0;16>n;n++){for(var o=!0,e=!0,i=0;9>i;i++){var c=t[n+i&15];if(!this.isBrighter(r,c,a)&&(e=!1,o===!1))break;if(!this.isDarker(r,c,a)&&(o=!1,e===!1))break}if(e||o)return!0}return!1},tracking.Fast.isDarker=function(r,t,a){return t-r>a},tracking.Fast.isTriviallyExcluded=function(r,t,a){var n=0,o=r[8],e=r[12],i=r[4],c=r[0];return this.isBrighter(c,t,a)&&n++,this.isBrighter(i,t,a)&&n++,this.isBrighter(o,t,a)&&n++,this.isBrighter(e,t,a)&&n++,3>n&&(n=0,this.isDarker(c,t,a)&&n++,this.isDarker(i,t,a)&&n++,this.isDarker(o,t,a)&&n++,this.isDarker(e,t,a)&&n++,3>n)?!0:!1},tracking.Fast.getCircleOffsets_=function(r){if(this.circles_[r])return this.circles_[r];var t=new Int32Array(16);return t[0]=-r-r-r,t[1]=t[0]+1,t[2]=t[1]+r+1,t[3]=t[2]+r+1,t[4]=t[3]+r,t[5]=t[4]+r,t[6]=t[5]+r-1,t[7]=t[6]+r-1,t[8]=t[7]-1,t[9]=t[8]-1,t[10]=t[9]-r-1,t[11]=t[10]-r-1,t[12]=t[11]-r,t[13]=t[12]-r,t[14]=t[13]-r+1,t[15]=t[14]-r+1,this.circles_[r]=t,t}}(),function(){tracking.Image={},tracking.Image.computeIntegralImage=function(r,t,a,n,o,e,i){if(arguments.length<4)throw new Error("You should specify at least one output array in the order: sum, square, tilted, sobel.");var c;i&&(c=tracking.Image.sobel(r,t,a));for(var s=0;a>s;s++)for(var f=0;t>f;f++){var u=s*t*4+4*f,g=~~(.299*r[u]+.587*r[u+1]+.114*r[u+2]);if(n&&this.computePixelValueSAT_(n,t,s,f,g),o&&this.computePixelValueSAT_(o,t,s,f,g*g),e){var l=u-4*t,h=~~(.299*r[l]+.587*r[l+1]+.114*r[l+2]);this.computePixelValueRSAT_(e,t,s,f,g,h||0)}i&&this.computePixelValueSAT_(i,t,s,f,c[u])}},tracking.Image.computePixelValueRSAT_=function(r,t,a,n,o,e){var i=a*t+n;r[i]=(r[i-t-1]||0)+(r[i-t+1]||0)-(r[i-t-t]||0)+o+e},tracking.Image.computePixelValueSAT_=function(r,t,a,n,o){var e=a*t+n;r[e]=(r[e-t]||0)+(r[e-1]||0)+o-(r[e-t-1]||0)},tracking.Image.grayscale=function(r,t,a){for(var n=new Uint8ClampedArray(t*a*4),o=0,e=0,i=0;a>i;i++)for(var c=0;t>c;c++){var s=.299*r[e]+.587*r[e+1]+.114*r[e+2];n[o++]=s,n[o++]=s,n[o++]=s,n[o++]=r[e+3],e+=4}return n},tracking.Image.horizontalConvolve=function(r,t,a,n,o){for(var e=n.length,i=Math.floor(e/2),c=new Float32Array(t*a*4),s=o?1:0,f=0;a>f;f++)for(var u=0;t>u;u++){for(var g=f,l=u,h=4*(f*t+u),k=0,p=0,y=0,v=0,d=0;e>d;d++){var A=g,m=Math.min(t-1,Math.max(0,l+d-i)),w=4*(A*t+m),T=n[d];k+=r[w]*T,p+=r[w+1]*T,y+=r[w+2]*T,v+=r[w+3]*T}c[h]=k,c[h+1]=p,c[h+2]=y,c[h+3]=v+s*(255-v)}return c},tracking.Image.verticalConvolve=function(r,t,a,n,o){for(var e=n.length,i=Math.floor(e/2),c=new Float32Array(t*a*4),s=o?1:0,f=0;a>f;f++)for(var u=0;t>u;u++){for(var g=f,l=u,h=4*(f*t+u),k=0,p=0,y=0,v=0,d=0;e>d;d++){var A=Math.min(a-1,Math.max(0,g+d-i)),m=l,w=4*(A*t+m),T=n[d];k+=r[w]*T,p+=r[w+1]*T,y+=r[w+2]*T,v+=r[w+3]*T}c[h]=k,c[h+1]=p,c[h+2]=y,c[h+3]=v+s*(255-v)}return c},tracking.Image.separableConvolve=function(r,t,a,n,o,e){var i=this.verticalConvolve(r,t,a,o,e);return this.horizontalConvolve(i,t,a,n,e)},tracking.Image.sobel=function(r,t,a){r=this.grayscale(r,t,a);for(var n=new Float32Array(t*a*4),o=new Float32Array([-1,0,1]),e=new Float32Array([1,2,1]),i=this.separableConvolve(r,t,a,o,e),c=this.separableConvolve(r,t,a,e,o),s=0;s<n.length;s+=4){var f=i[s],u=c[s],g=Math.sqrt(u*u+f*f);n[s]=g,n[s+1]=g,n[s+2]=g,n[s+3]=255}return n}}(),function(){tracking.Math={},tracking.Math.distance=function(r,t,a,n){var o=a-r,e=n-t;return Math.sqrt(o*o+e*e)},tracking.Math.hammingWeight=function(r){return r-=r>>1&1431655765,r=(858993459&r)+(r>>2&858993459),16843009*(r+(r>>4)&252645135)>>24},tracking.Math.uniformRandom=function(r,t){return r+Math.random()*(t-r)},tracking.Math.intersectRect=function(r,t,a,n,o,e,i,c){return!(o>a||r>i||e>n||t>c)}}(),function(){tracking.Matrix={},tracking.Matrix.forEach=function(r,t,a,n,o){o=o||1;for(var e=0;a>e;e+=o)for(var i=0;t>i;i+=o){var c=e*t*4+4*i;n.call(this,r[c],r[c+1],r[c+2],r[c+3],c,e,i)}}}(),function(){tracking.DisjointSet=function(r){if(void 0===r)throw new Error("DisjointSet length not specified.");this.length=r,this.parent=new Uint32Array(r);for(var t=0;r>t;t++)this.parent[t]=t},tracking.DisjointSet.prototype.length=null,tracking.DisjointSet.prototype.parent=null,tracking.DisjointSet.prototype.find=function(r){return this.parent[r]===r?r:this.parent[r]=this.find(this.parent[r])},tracking.DisjointSet.prototype.union=function(r,t){var a=this.find(r),n=this.find(t);this.parent[a]=n}}(),function(){tracking.Tracker=function(){},tracking.Tracker.prototype.onFound=function(){},tracking.Tracker.prototype.onNotFound=function(){},tracking.Tracker.prototype.track=function(){}}(),function(){tracking.HAARTracker=function(){tracking.HAARTracker.base(this,"constructor")},tracking.inherits(tracking.HAARTracker,tracking.Tracker),tracking.HAARTracker.data={},tracking.HAARTracker.prototype.data=null,tracking.HAARTracker.prototype.edgesDensity=.2,tracking.HAARTracker.prototype.initialScale=1,tracking.HAARTracker.prototype.scaleFactor=1.25,tracking.HAARTracker.prototype.stepSize=1.5,tracking.HAARTracker.prototype.getData=function(){return this.data},tracking.HAARTracker.prototype.getEdgesDensity=function(){return this.edgesDensity},tracking.HAARTracker.prototype.getInitialScale=function(){return this.initialScale},tracking.HAARTracker.prototype.getScaleFactor=function(){return this.scaleFactor},tracking.HAARTracker.prototype.getStepSize=function(){return this.stepSize},tracking.HAARTracker.prototype.track=function(r,t,a){var n=this.getData();if(!n)throw new Error("HAAR cascade data not set.");var o=tracking.ViolaJones.detect(r,t,a,this.getInitialScale(),this.getScaleFactor(),this.getStepSize(),this.getEdgesDensity(),n);o.length?this.onFound&&this.onFound.call(this,o):this.onNotFound&&this.onNotFound.call(this,o)},tracking.HAARTracker.prototype.setData=function(r){this.data=r},tracking.HAARTracker.prototype.setEdgesDensity=function(r){this.edgesDensity=r},tracking.HAARTracker.prototype.setInitialScale=function(r){this.initialScale=r},tracking.HAARTracker.prototype.setScaleFactor=function(r){this.scaleFactor=r},tracking.HAARTracker.prototype.setStepSize=function(r){this.stepSize=r}}(),function(){tracking.ColorTracker=function(){tracking.ColorTracker.base(this,"constructor"),this.setColors(["magenta"])},tracking.inherits(tracking.ColorTracker,tracking.Tracker),tracking.ColorTracker.MIN_PIXELS=30,tracking.ColorTracker.knownColors_={},tracking.ColorTracker.registerColor=function(r,t){tracking.ColorTracker.knownColors_[r]=t},tracking.ColorTracker.getColor=function(r){return tracking.ColorTracker.knownColors_[r]},tracking.ColorTracker.prototype.colors=null,tracking.ColorTracker.prototype.calculateCentralCoordinate_=function(r,t){for(var a=0,n=0,o=-1,e=-1,i=1/0,c=1/0,s=0,f=0;t>f;f+=2){var u=r[f],g=r[f+1];u>-1&&g>-1&&(a+=u,n+=g,s++,i>u&&(i=u),u>o&&(o=u),c>g&&(c=g),g>e&&(e=g))}return 0===s?null:{x:a/s,y:n/s,z:60-(o-i+(e-c))/2}},tracking.ColorTracker.prototype.flagOutliers_=function(r,t){for(var a=0;t>a;a+=2){for(var n=0,o=2;t>o;o+=2)n+=tracking.Math.distance(r[a],r[a+1],r[o],r[o+1]);n/t>=tracking.ColorTracker.MIN_PIXELS&&(r[a]=-1,r[a+1]=-1,t[a]--)}},tracking.ColorTracker.prototype.getColors=function(){return this.colors},tracking.ColorTracker.prototype.setColors=function(r){this.colors=r},tracking.ColorTracker.prototype.track=function(r,t,a){var n,o,e,i=this,c=this.getColors(),s=[],f=[],u=[];for(tracking.Matrix.forEach(r,t,a,function(r,t,a,f,g,l,h){for(e=-1;n=c[++e];)s[e]||(u[e]=0,s[e]=[]),o=tracking.ColorTracker.knownColors_[n],o&&o.call(i,r,t,a,f,g,l,h)&&(u[e]+=2,s[e].push(h,l))}),e=-1;n=c[++e];)if(!(u[e]<tracking.ColorTracker.MIN_PIXELS)){i.flagOutliers_(s[e],u[e]);var g=i.calculateCentralCoordinate_(s[e],u[e]);g&&(g.color=c[e],g.pixels=s[e],f.push(g))}f.length?i.onFound&&i.onFound.call(i,f):i.onNotFound&&i.onNotFound.call(i,f)},tracking.ColorTracker.registerColor("cyan",function(r,t,a){var n=50,o=70,e=r-0,i=t-255,c=a-255;return t-r>=n&&a-r>=o?!0:Math.sqrt(e*e+i*i+c*c)<80}),tracking.ColorTracker.registerColor("magenta",function(r,t,a){var n=50,o=r-255,e=t-0,i=a-255;return r-t>=n&&a-t>=n?!0:Math.sqrt(o*o+e*e+i*i)<140}),tracking.ColorTracker.registerColor("yellow",function(r,t,a){var n=50,o=r-255,e=t-255,i=a-0;return r-t>=n&&a-t>=n?!0:Math.sqrt(o*o+e*e+i*i)<100})}(),function(){tracking.EyeTracker=function(){tracking.EyeTracker.base(this,"constructor");var r=tracking.HAARTracker.data.eye;r&&this.setData(new Float64Array(r))},tracking.inherits(tracking.EyeTracker,tracking.HAARTracker)}(),function(){tracking.FaceTracker=function(){tracking.FaceTracker.base(this,"constructor");var r=tracking.HAARTracker.data.face;r&&this.setData(new Float64Array(r))},tracking.inherits(tracking.FaceTracker,tracking.HAARTracker)}(),function(){tracking.MouthTracker=function(){tracking.MouthTracker.base(this,"constructor");var r=tracking.HAARTracker.data.mouth;r&&this.setData(new Float64Array(r))},tracking.inherits(tracking.MouthTracker,tracking.HAARTracker)}(),function(){tracking.KeypointTracker=function(){tracking.Tracker.base(this,"constructor")},tracking.inherits(tracking.KeypointTracker,tracking.Tracker),tracking.KeypointTracker.prototype.cameraMatrix=null,tracking.KeypointTracker.prototype.estimatePose=function(){},tracking.KeypointTracker.prototype.extractKeypoints=function(){},tracking.KeypointTracker.prototype.getCameraMatrix=function(){var r=this;return r.cameraMatrix||(r.cameraMatrix=new tracking.Matrix({matrix:[[2868.4,0,1219.5],[0,2872.1,1591.7],[0,0,1]]})),r.cameraMatrix},tracking.KeypointTracker.prototype.matchKeypoints=function(){},tracking.KeypointTracker.prototype.setCameraMatrix=function(r){this.cameraMatrix=r},tracking.KeypointTracker.prototype.track=function(){}}();