---
# URLs like index.html#/5: work from file:// (make html.local) and on any
# static web server, also when reloading a slide
routerMode: hash
# You can also start simply with 'default'
theme: neversink
# auto = dark/light toggle in the toolbar (dark on first visit, see setup/main.ts)
colorSchema: auto
# every slide gets strokes; override per slide with `class: lw bg-strokes-soft`
# (or `layoutClass: lw bg-strokes-soft` on two-cols-header slides)
defaults:
  class: lw bg-strokes
  layoutClass: lw bg-strokes
# the title slide keeps the grid
class: lw bg-grid
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
# background: https://cover.sli.dev
# some information about your slides (markdown enabled)
title: "Syntax trees with binders made easy: the Elpi programming language"
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
layout: lw-cover
ximage: logo.png
transition: fade
level: 2
hideInToc: true
# Elpi is a logic programming language descendant of λProlog well suited to manipulate syntax trees with binders. Elpi comes as an interpreter designed to be embedded into larger OCaml applications as an extension language.
# In this talk I give a gentle introduction to logic programming and how its rule-based nature makes it easy to manipulate syntax trees that contain binders or that are incomplete. I then focus on how Elpi can be used to extend an OCaml application via its foreign function interface.
---

<h2 style="text-align:center">Syntax trees with binders made easy
<br/>
<br/>
<span style="font-size: 0.8em">the <span class="chip"><ElpiLogo /></span> programming language</span></h2>

<div style="text-align: right">
<br/>
<span class="lw-name">Enrico Tassi</span> &nbsp;&nbsp;
<a href="https://github.com/gares" style="white-space: nowrap"><mdi-github style="vertical-align: middle"/> @gares</a>
 &nbsp;&nbsp;
<img src="/inria.svg" alt="Inria" style="display: inline-block; height: 1.3em; vertical-align: middle"> 

</div>

<!--
First of all thanks the orga
-->

---
layout: lw-default
level: 2
hideInToc: true
title: Summary
class: lw bg-grid lw-summary
---

# Summary
<Toc minDepth="1" maxDepth="2" />


---
layout: lw-section
---

# Elpi 101

---
layout: lw-default
level: 2
timeline:
  - year: 1965
    short: Unification
    what: the resolution proof method
    people:
      - { name: J. Alan Robinson, img: /history/robinson.jpg }
  - year: 1972–74
    short: Prolog
    what: Horn clauses as programs, SLD-resolution
    people:
      - { name: Alain Colmerauer, img: /history/colmerauer.jpg }
      - { name: Robert Kowalski, img: /history/kowalski.jpg }
  - year: 1983
    short: WAM
    what: the Warren Abstract Machine
    people:
      - { name: David H. D. Warren, img: /history/warren.jpg }
  - year: 1986
    short: λProlog
    what: higher-order logic programming
    people:
      - { name: Dale Miller, img: /history/miller.jpg }
      - { name: Gopalan Nadathur, img: /history/nadathur.jpg }
  - year: 1991
    short: CHR
    what: Constraint Handling Rules
    people:
      - { name: Thom Frühwirth }
  - year: 2015
    short: Elpi
    what: λProlog + CHR, an extension language
    people:
      - { name: Enrico Tassi, img: /avatars/gares.jpg }
      - { name: Claudio Sacerdoti Coen, img: /avatars/sacerdot.jpg }
---

# A bit of history

<Timeline :items="$frontmatter.timeline" />

<div class="lw-credit">Photos: Robinson by D. Monniaux (CC BY-SA 3.0), Colmerauer by Alaindavid2 (CC BY-SA 4.0), Kowalski by Yongyuth (CC BY 3.0), Wikimedia Commons; Warren: academia.edu; Miller: researchr.org; Nadathur: his homepage -- Disclaimer: This history is very partial; moreover all these people are much smarter than me and Elpi would not even exist without their work.</div>

---
layout: lw-default
class: lw lw-run-side bg-strokes
level: 2
---

# Unification and backtracking

<<< @/snippets/unif_backtrack.elpi elpi {monaco-run}

---
layout: lw-default
class: lw lw-run-side bg-strokes
level: 2
---

# Rules and functions

<<< @/snippets/rules_functions.elpi elpi {monaco-run}

---
layout: lw-default
class: lw lw-run-side bg-strokes
level: 2
---

# Syntax with binders

<<< @/snippets/hoas.elpi elpi {monaco-run}


---
layout: two-cols-header
level: 2
---

# A simple type checker

::left::

Simply typed $\lambda$-calculus in $\lambda$-tree syntax (HOAS)

<<< @/snippets/stlc.elpi#symbs elpi

Typing


````md magic-move {at:1}
```elpi
func of tm -> ty.
of (app H A) T :-
  of H (arr S T), of A S.
of (lam F) (arr S T) :-
  pi x\ of x S ==>
        of (F x) T.
```

```elpi {4}
func of tm -> ty.
of (app H A) T :-
  of H (arr S T), of A S.
of (lam F) (arr S T) :-    % F = x\ lam y\ x
  pi x\ of x S ==>
        of (F x) T.
```

```elpi {2,5-6}
func of tm -> ty.
of c S0.        % assumed: pi x\ ... ==>
of (app H A) T :-
  of H (arr S T), of A S.
of (lam F) (arr S T) :-    % F = x\ lam y\ x
  pi x\ of x S ==>
        of (F x) T.
```

```elpi {5,7}
func of tm -> ty.
of c S0.        % assumed: pi x\ ... ==>
of (app H A) T :-
  of H (arr S T), of A S.
of (lam F) (arr S T) :-    % F = x\ lam y\ x
  pi x\ of x S ==>
        of (F x) T.
```

```elpi {5}
func of tm -> ty.
of c S0.        % assumed: pi x\ ... ==>
of (app H A) T :-
  of H (arr S T), of A S.
of (lam F) (arr S T) :-    % F = y\ c
  pi x\ of x S ==>
        of (F x) T.
```

```elpi {2,6-7}
func of tm -> ty.
of d S1.        % assumed: pi x\ ... ==>
of c S0.        % assumed: pi x\ ... ==>
of (app H A) T :-
  of H (arr S T), of A S.
of (lam F) (arr S T) :-    % F = y\ c
  pi x\ of x S ==>
        of (F x) T.
```

```elpi {6,8}
func of tm -> ty.
of d S1.        % assumed: pi x\ ... ==>
of c S0.        % assumed: pi x\ ... ==>
of (app H A) T :-
  of H (arr S T), of A S.
of (lam F) (arr S T) :-    % F = y\ c
  pi x\ of x S ==>
        of (F x) T.
```

```elpi {3}
func of tm -> ty.
of d S1.        % assumed: pi x\ ... ==>
of c S0.        % assumed: pi x\ ... ==>   T1 = S0
of (app H A) T :-
  of H (arr S T), of A S.
of (lam F) (arr S T) :-
  pi x\ of x S ==>
        of (F x) T.
```

```elpi
func of tm -> ty.
of d S1.        % assumed: pi x\ ... ==>
of c S0.        % assumed: pi x\ ... ==>
of (app H A) T :-
  of H (arr S T), of A S.
of (lam F) (arr S T) :-
  pi x\ of x S ==>
        of (F x) T.
```

```elpi
func of tm -> ty.
of (app H A) T :-
  of H (arr S T), of A S.
of (lam F) (arr S T) :-
  pi x\ of x S ==>
        of (F x) T.
```

```elpi {2}
func of tm -> ty.
of (app H A) T :-
  of H (arr S T), of A S.
of (lam F) (arr S T) :-
  pi x\ of x S ==>
        of (F x) T.
```

```elpi {2-3}
func of tm -> ty.
of (app H A) T :-
  of H (arr S T), of A S.
of (lam F) (arr S T) :-
  pi x\ of x S ==>
        of (F x) T.
```

```elpi {none}
func of tm -> ty.
of (app H A) T :-
  of H (arr S T), of A S.
of (lam F) (arr S T) :-
  pi x\ of x S ==>
        of (F x) T.
```
````

<br/>
<br/>
<br/>

::right::

<div class="h-36">

````md magic-move {at:1}
```elpi
?- of (lam x\ lam y\ x) TyFst.
```

```elpi {1}
?- of (lam x\ lam y\ x) TyFst.
```

```elpi {1}
?- of (lam x\ lam y\ x) TyFst.
```

```elpi {2}
?- of (lam x\ lam y\ x) TyFst.
?- of        (lam y\ c) T0.
```

```elpi {2}
?- of (lam x\ lam y\ x) TyFst.
?- of        (lam y\ c) T0.
```

```elpi {2}
?- of (lam x\ lam y\ x) TyFst.
?- of        (lam y\ c) T0.
```

```elpi {3}
?- of (lam x\ lam y\ x) TyFst.
?- of        (lam y\ c) T0.
?- of                c  T1.
```

```elpi {3}
?- of (lam x\ lam y\ x) TyFst.
?- of        (lam y\ c) T0.
?- of                c  T1.
```

```elpi {4}
?- of (lam x\ lam y\ x) TyFst.
?- of        (lam y\ c) T0.
?- of                c  T1.
   (no goals left)
```

```elpi {3}
?- of (lam x\ lam y\ x) TyFst.

Success: TyFst = arr S0 (arr S1 S0)
```

```elpi {1}
?- of (app H A) T.
```

```elpi {2}
?- of (app H A) T.
?- of H (arr S T).
```

```elpi {2,4}
?- of (app H A) T.
?- of H (arr S T).

Failure.
```
````

</div>

````md magic-move {at:1}
```elpi
heap:
```

```elpi {2}
heap:
  TyFst ↦ arr S0 T0
```

```elpi
heap:
  TyFst ↦ arr S0 T0
```

```elpi
heap:
  TyFst ↦ arr S0 T0
```

```elpi {2-3}
heap:
  TyFst ↦ arr S0 (arr S1 T1)
  T0    ↦ arr S1 T1
```

```elpi
heap:
  TyFst ↦ arr S0 (arr S1 T1)
  T0    ↦ arr S1 T1
```

```elpi
heap:
  TyFst ↦ arr S0 (arr S1 T1)
  T0    ↦ arr S1 T1
```

```elpi {2-4}
heap:
  TyFst ↦ arr S0 (arr S1 S0)
  T0    ↦ arr S1 S0
  T1    ↦ S0
```

```elpi
heap:
  TyFst ↦ arr S0 (arr S1 S0)
  T0    ↦ arr S1 S0
  T1    ↦ S0
```

```elpi
heap:
  TyFst ↦ arr S0 (arr S1 S0)
  T0    ↦ arr S1 S0
  T1    ↦ S0
```

```elpi
heap:
```

```elpi
heap:
```

```elpi
heap:
```
````

---
layout: lw-default
class: lw lw-run-side bg-strokes
level: 2
hideInToc: true
---

# Elpi = <span class="normal-case">$\lambda$Prolog</span> + C..


<<< @/snippets/stlc_delay.elpi elpi {monaco-run}

---
layout: lw-default
class: lw lw-run-side bg-strokes
level: 2
---

# Elpi = <span class="normal-case">$\lambda$Prolog</span> + CHR


<<< @/snippets/stlc_delay_chr.elpi elpi {monaco-run}

---
layout: lw-default
class: lw lw-run-side bg-strokes
hideInToc: true
hide: true
---

# Spilling relations: Functional syntax

<br/>

### Relation → function

```elpi {monaco-run}
func std.rev list A -> list A.
main :-
  L = [1,2,3],
  std.rev L RL,
  std.append L RL LP,
  print LP.
```

<br/>

### Function → relation

```elpi {monaco-run}
func map (func A -> B), list A -> list B.
map _ [] -> [].
map F [X|XS] -> [F X|map F XS].

main :-
  map (x\r\ r is x + 1) [1,2,3] L,
  print L.
```

---
layout: lw-section
---

# One language to rule them all

---
layout: lw-default
level: 2
hideInToc: true
---

# One language to rule them all?

<div class="h-full flex items-center justify-center">
  <img src="/One_Ring_Blender_Render.png" alt="The One Ring" class="max-h-100 object-contain" />
</div>

<div class="lw-credit">Par Peter J. Yost — Travail personnel, CC BY-SA 4.0, <a href="https://commons.wikimedia.org/w/index.php?curid=98351026">https://commons.wikimedia.org/w/index.php?curid=98351026</a></div>

---
layout: lw-default
level: 2
hideInToc: true
---

# Nope, two is better than one!

<div class="h-full flex items-center justify-center gap-16">
  <img src="/One_Ring_Blender_Render.png" alt="The One Ring" class="max-h-90 object-contain" />
  <img src="/One_Ring_Blender_Render2.png" alt="The One Ring" class="max-h-90 object-contain" />
</div>

<div class="lw-credit">Par Peter J. Yost — Travail personnel, CC BY-SA 4.0, <a href="https://commons.wikimedia.org/w/index.php?curid=98351026">https://commons.wikimedia.org/w/index.php?curid=98351026</a></div>

---
layout: lw-default
level: 2
hideInToc: true
---

# strengths add up, weaknesses cancel out

<div class="grid grid-cols-2 gap-12 mt-6 text-center">
<div>

<div class="h-32 flex items-center justify-center">
  <img src="/ocaml-logo.svg" alt="OCaml logo" class="on-white h-24" />
</div>

<div class="pros">

- speed
- large codebase

</div>
<div class="cons">

- binders
- incomplete terms

</div>

</div>
<div>

<div class="h-32 flex items-center justify-center">
  <img src="/elpi-icon2-black.png" alt="Elpi logo" class="on-white h-24" style="padding: 1.6rem 1.2rem" />
</div>

<div class="cons">

- interpreter
- tiny language

</div>
<div class="pros">

- high level
- HOAS

</div>

</div>
</div>

---
layout: lw-default
level: 2
---

# There and Back Again

```ocaml {1-2,6-9}
module Conversion : sig
  type 'a t = {
    ty : ty_ast;
    pp_doc : Format.formatter -> unit -> unit;
    pp : Format.formatter -> 'a -> unit;
    embed : 'a embedding;   (* 'a -> term *)
    readback : 'a readback; (* term -> 'a *)
  }
end
```

```ocaml
module BuiltInData : sig
  val int    : int Conversion.t
  val float  : float Conversion.t
  val string : string Conversion.t
  val list   : 'a Conversion.t -> 'a list Conversion.t
  type diagnostic = OK | ERROR of string
  val diagnostic : diagnostic API.Conversion.t
end
```

---
layout: lw-default
class: lw lw-run-side
level: 2
---

# the FFI by examples

```ocaml
type t = Pred : name * 'a ffi * 'a -> t

let builtin =
  MLCode (Pred ("sys.readdir",
    In  (string, "DirPath",
    Out (list string, "Contents",
    Out (diagnostic, "Diagnostic",
    Easy "is like [Sys.readdir]. It succeeds if [Diagnostic = ok] and [Contents] is the list of files
          in [DirPath] or [Diagnostic = error Msg] and [Msg] describes an encountered system error."))),
  (fun path _ _ ~depth:_ ->
    match Sys.readdir path |> Array.to_list with
    | contents -> !: contents +! OK
    | exception Sys_error e -> ?: None +! ERROR e))),

```

```elpi {monaco-run}
main :- sys.readdir "." L D, print D "L =" L.
```

---
layout: two-cols-header
level: 2
---

# automatic glue code: ppx_elpi

::left::

```ocaml
type ty = Arr of ty * ty | Int
[@@deriving elpi]

type tctx = CtxEntry of (string[@elpi.key "term"]) * ty
[@@elpi.index (module String)]
[@@deriving elpi]

type term =
  | Var of { name : string } [@elpi.var tctx]
  | App of { head : term; arg : term }
  | Lam of { name : string;
             ty : ty;
             body : (term[@elpi.binder "term" tctx
                            (fun name ty ->
                               CtxEntry (name, ty))]) }
[@@deriving elpi]
```

::right::

```elpi
data ty.
symb arr : ty -> ty -> ty.  % Arr
symb int : ty.  % Int

func ctxentry term -> string, ty.


data term.
symb app : term -> term -> term.  % App
symb lam : string -> ty -> (term -> term) -> term.  % Lam


```

---
layout: two-cols-header
level: 2
hide: true
---

# Quotations

::left::

```ocaml
open Elpi.API

let parse_my_lang : string -> Ast.Term.t =
    (* parse my lang into an Elpi AST *)
    Quotation.elpi : string -> Ast.Term.t

let () = Quotation.set_default_quotation parse_my_lang
```

<br/>

```elpi
main :-
  F = {{ fun (x : int) (y : {{ T }}) -> x }},
  %     ....my_lang......... elpi  .......
  T = {{ int }},
  print "The term F is:" F.
```

::right::

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

```
The term F is: lam int x\ lam int y\ x
```

---
layout: lw-section
level: 1
---

# Integration in the Rocq Prover

<div class="flex items-center justify-center gap-8 mt-6 logo-equation">
  <img src="/rocq-logo.svg" alt="Rocq" class="on-white h-20" style="padding: 1rem 1.2rem" />
  <span>+</span>
  <img src="/elpi-icon2-black.png" alt="Elpi" class="on-white h-20" style="padding: 1.3rem 1.2rem" />
  <span>=</span>
  <img src="/rocq-elpi-logo.png" alt="Rocq-Elpi" class="on-white h-40" />
</div>

<div class="lw-credit">Rocq-Elpi logo by Reynald Affeldt</div>

---
layout: two-cols-header
level: 2
hideInToc: true
---

# Integration in the Rocq Prover

[Rocq]{.chip} programs, specs and proofs in one language: written in [OCaml]{.chip} extended in [Elpi]{.chip}

<style>
h2 { margin: .8rem 0 .2rem; }
li { margin-bottom: .1em; }
.slidev-code { margin: .3rem 0 !important; }
</style>

::left::

## APIs

- 91 data types
- 272 builtins

## Quotations

```elpi
main :-
  F = {{ fun (x : int) (y : lp:T) => x }},
  %     .... rocq ......... elpi  .......
  T = {{ int }},
  print "The term F is:" F.
```

::right::

## Derive

```coq
#[only(lens_laws,map)] derive
Record Box A := { contents : A; tag : nat }.

Check box_map : (A -> B) -> Box A -> Box B.

Check _tag : Lens (Box A) nat.

Check set_tag_twice:
  ∀ A (r : Box A) y x,
    set tag x (set tag y r) = set tag x r.
```


---
layout: lw-section
---

# Conclusion

---
layout: default
hideInToc: true
---

# take home

<br/>

## Extension languages
  - Use a language (only) when it is a good fit
  - Niche language? Not a problem in 2026
  
## Elpi is a good fit for
  - Syntax with binders & holes
  - OCaml ecosystem


---
layout: two-cols-header
image: logo.png
backgroundSize: 80%
hideInToc: true
---

# Thanks for contributing code! {style="text-align:center"}

<div style="text-align:center">

</div>

:: right ::

<div class="vauthors">



![Armael](/avatars/Armael.jpg)
![artagnon](/avatars/artagnon.jpg)
![bgregoir](/avatars/bgregoir.jpg)
![Blaisorblade](/avatars/Blaisorblade.jpg)
![cdunchev](/avatars/cdunchev.jpg)
![CohenCyril](/avatars/CohenCyril.jpg)
![dwarfmaster](/avatars/dwarfmaster.jpg)
![ecranceMERCE](/avatars/ecranceMERCE.jpg)
![ejgallego](/avatars/ejgallego.jpg)
![eponier](/avatars/eponier.jpg)
![FissoreD](/avatars/FissoreD.jpg)
<!-- ![gares](/avatars/gares.jpg) -->
![gdufrc](/avatars/gdufrc.jpg)
![herbelin](/avatars/herbelin.jpg)
![jfehrle](/avatars/jfehrle.jpg)
![jwintz](/avatars/jwintz.jpg)
![kit-ty-kate](/avatars/kit-ty-kate.jpg)
![lthls](/avatars/lthls.jpg)
![lukovdm](/avatars/lukovdm.jpg)
![maximedenes](/avatars/maximedenes.jpg)
![mb64](/avatars/mb64.jpg)
![MSoegtropIMC](/avatars/MSoegtropIMC.jpg)
![palmskog](/avatars/palmskog.jpg)
![pedrotst](/avatars/pedrotst.jpg)
![phikal](/avatars/phikal.jpg)
![pi8027](/avatars/pi8027.jpg)
![ppedrot](/avatars/ppedrot.jpg)
![proux01](/avatars/proux01.jpg)
![rgrinberg](/avatars/rgrinberg.jpg)
![rlepigre](/avatars/rlepigre.jpg)
![robblanco](/avatars/robblanco.jpg)
![sacerdot](/avatars/sacerdot.jpg)
![shonfeder](/avatars/shonfeder.jpg)
![SimonBoulier](/avatars/SimonBoulier.jpg)
![SkySkimmer](/avatars/SkySkimmer.jpg)
![smuenzel](/avatars/smuenzel.jpg)
![Tragicus](/avatars/Tragicus.jpg)
![vbgl](/avatars/vbgl.jpg)
![VojtechStep](/avatars/VojtechStep.jpg)
![voodoos](/avatars/voodoos.jpg)
![wdeweijer](/avatars/wdeweijer.jpg)
![whonore](/avatars/whonore.jpg)
![XVilka](/avatars/XVilka.jpg)
![ybertot](/avatars/ybertot.jpg)
![yoichi-at-bedrock](/avatars/yoichi-at-bedrock.jpg)
![Zimmi48](/avatars/Zimmi48.jpg)

</div>

<br/>

:: left ::

<!--![logo](/logo.png){style="width:40%; margin-left:auto; margin-right: auto;"}-->

<div style="text-align:justify">

Pedro Abreu, Yves Bertot, Frederic Besson, Rob Blanco, Simon Boulier, Luc Chabassier, Cyril Cohen, Enzo Crance, Maxime Dénès, Jim Fehrle, Davide Fissore, Paolo G. Giarrusso, Gaëtan Gilbert, Benjamin Gregoire, Hugo Herbelin, Yoichi Hirai, Jasper Hugunin, Emilio Jesus Gallego Arias, Jan-Oliver Kaiser, Philip Kaludercic, Chantal Keller, Vincent Laporte, Jean-Christophe Léchenet, Rodolphe Lepigre, Karl Palmskog, Pierre-Marie Pédrot, Ramkumar Ramachandra, Pierre Roux, Claudio Sacerdoti Coen, Kazuhiko Sakaguchi, Matthieu Sozeau, Gordon Stewart, David Swasey, Alexey Trilis, Quentin Vermande, Théo Zimmermann, wdewe, whonore 

</div>

---
layout: lw-end
level: 2
title: Thanks
class: lw bg-grid
---

# Thanks for listening! {style="text-align:center"}

<div class="flex flex-col items-center gap-2" style="margin-top: -1.5rem">

<a href="https://github.com/LPCIC/elpi/" style="border: 0"><img src="/qr-elpi.svg" alt="QR code: https://github.com/LPCIC/elpi/" class="h-56 rounded" /></a>

<div class="lw-end-url">github.com/LPCIC/elpi</div>

<div>
<span class="lw-name">Enrico Tassi</span> &nbsp;&nbsp;
<a href="https://github.com/gares" style="white-space: nowrap"><mdi-github style="vertical-align: middle"/> @gares</a>
 &nbsp;&nbsp;
<img src="/inria.svg" alt="Inria" style="display: inline-block; height: 1.3em; vertical-align: middle">
</div>

<div class="lw-end-event">
<img src="/lw/logos-3.png" alt="Lambda World, WeyWeyWeb, On the Beach" class="h-10 inline-block" />
&nbsp; Lambda World · Málaga · 30 October 2026
</div>

</div>



