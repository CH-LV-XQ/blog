"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[218],{6262:(i,s)=>{s.A=(i,s)=>{const a=i.__vccOpts||i;for(const[i,n]of s)a[i]=n;return a}},2373:(i,s,a)=>{a.r(s),a.d(s,{comp:()=>t,data:()=>e});var n=a(641);const l={},t=(0,a(6262).A)(l,[["render",function(i,s){return(0,n.uX)(),(0,n.CE)("div",null,s[0]||(s[0]=[(0,n.Fv)('<h1 id="conda-使用" tabindex="-1"><a class="header-anchor" href="#conda-使用"><span>Conda 使用</span></a></h1><h2 id="常用命令" tabindex="-1"><a class="header-anchor" href="#常用命令"><span>常用命令</span></a></h2><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 查看版本</span></span>\n<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">conda</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> --version</span></span>\n<span class="line"></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 查看所有虚拟环境</span></span>\n<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">conda</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> env</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> list</span></span>\n<span class="line"></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 创建虚拟环境</span></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># rag为当前虚拟环境名称</span></span>\n<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">conda</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> create</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> -n</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> rag</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> python=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">3.10</span></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 删除虚拟环境</span></span>\n<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">conda</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> remove</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> --name</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> rag</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> --all</span></span>\n<span class="line"></span>\n<span class="line"></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 切换激活环境</span></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># windows</span></span>\n<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">conda</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> activate</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> rag</span></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># Linux/Unix</span></span>\n<span class="line"><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">source</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> activate</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> rag</span></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 返回base环境</span></span>\n<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">conda</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> deactivate</span></span>\n<span class="line"></span>\n<span class="line"></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 下载（卸载）库</span></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 下载安装</span></span>\n<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">conda</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> install</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> scipy</span></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 卸载</span></span>\n<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">conda</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> remove</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> scipy</span></span>\n<span class="line"></span>\n<span class="line"></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 切换镜像源</span></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 添加清华镜像源</span></span>\n<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">conda</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> config</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> --add</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> channels</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/</span></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 设置安装包时，显示源</span></span>\n<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">conda</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> config</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> --set</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> show_channel_urls</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> yes</span></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 删除清华镜像源</span></span>\n<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">conda</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> config</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> --remove</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> channels</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/</span></span>\n<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"># 看现在使用了哪些源</span></span>\n<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">conda</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> config</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> --show</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> channels</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>',3)]))}]]),e=JSON.parse('{"path":"/posts/apple/conda.html","title":"Conda 使用","lang":"zh-CN","frontmatter":{"icon":"pen-to-square","date":"2022-01-01T00:00:00.000Z","category":["Python"],"tag":["conda"],"description":"Conda 使用 常用命令","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/blog/posts/apple/conda.html"}],["meta",{"property":"og:site_name","content":"博客演示"}],["meta",{"property":"og:title","content":"Conda 使用"}],["meta",{"property":"og:description","content":"Conda 使用 常用命令"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-02-11T12:59:04.000Z"}],["meta",{"property":"article:tag","content":"conda"}],["meta",{"property":"article:published_time","content":"2022-01-01T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2025-02-11T12:59:04.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Conda 使用\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-01-01T00:00:00.000Z\\",\\"dateModified\\":\\"2025-02-11T12:59:04.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Mr.Hope\\",\\"url\\":\\"https://mister-hope.com\\"}]}"]]},"headers":[{"level":2,"title":"常用命令","slug":"常用命令","link":"#常用命令","children":[]}],"git":{"createdTime":1731338722000,"updatedTime":1739278744000,"contributors":[{"name":"ch","email":"ch825523424@163.com","commits":1}]},"readingTime":{"minutes":0.55,"words":166},"filePathRelative":"posts/apple/conda.md","localizedDate":"2022年1月1日","excerpt":"\\n<h2>常用命令</h2>\\n<div class=\\"language-shell line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"shell\\" data-title=\\"shell\\" style=\\"--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes one-light one-dark-pro vp-code\\"><code><span class=\\"line\\"><span style=\\"--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic\\"># 查看版本</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#4078F2;--shiki-dark:#61AFEF\\">conda</span><span style=\\"--shiki-light:#986801;--shiki-dark:#D19A66\\"> --version</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic\\"># 查看所有虚拟环境</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#4078F2;--shiki-dark:#61AFEF\\">conda</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> env</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> list</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic\\"># 创建虚拟环境</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic\\"># rag为当前虚拟环境名称</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#4078F2;--shiki-dark:#61AFEF\\">conda</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> create</span><span style=\\"--shiki-light:#986801;--shiki-dark:#D19A66\\"> -n</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> rag</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> python=</span><span style=\\"--shiki-light:#986801;--shiki-dark:#D19A66\\">3.10</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic\\"># 删除虚拟环境</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#4078F2;--shiki-dark:#61AFEF\\">conda</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> remove</span><span style=\\"--shiki-light:#986801;--shiki-dark:#D19A66\\"> --name</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> rag</span><span style=\\"--shiki-light:#986801;--shiki-dark:#D19A66\\"> --all</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic\\"># 切换激活环境</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic\\"># windows</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#4078F2;--shiki-dark:#61AFEF\\">conda</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> activate</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> rag</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic\\"># Linux/Unix</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#0184BC;--shiki-dark:#56B6C2\\">source</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> activate</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> rag</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic\\"># 返回base环境</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#4078F2;--shiki-dark:#61AFEF\\">conda</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> deactivate</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic\\"># 下载（卸载）库</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic\\"># 下载安装</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#4078F2;--shiki-dark:#61AFEF\\">conda</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> install</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> scipy</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic\\"># 卸载</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#4078F2;--shiki-dark:#61AFEF\\">conda</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> remove</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> scipy</span></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic\\"># 切换镜像源</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic\\"># 添加清华镜像源</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#4078F2;--shiki-dark:#61AFEF\\">conda</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> config</span><span style=\\"--shiki-light:#986801;--shiki-dark:#D19A66\\"> --add</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> channels</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic\\"># 设置安装包时，显示源</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#4078F2;--shiki-dark:#61AFEF\\">conda</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> config</span><span style=\\"--shiki-light:#986801;--shiki-dark:#D19A66\\"> --set</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> show_channel_urls</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> yes</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic\\"># 删除清华镜像源</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#4078F2;--shiki-dark:#61AFEF\\">conda</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> config</span><span style=\\"--shiki-light:#986801;--shiki-dark:#D19A66\\"> --remove</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> channels</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic\\"># 看现在使用了哪些源</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#4078F2;--shiki-dark:#61AFEF\\">conda</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> config</span><span style=\\"--shiki-light:#986801;--shiki-dark:#D19A66\\"> --show</span><span style=\\"--shiki-light:#50A14F;--shiki-dark:#98C379\\"> channels</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}')}}]);