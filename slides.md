---
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

## Syntax trees with binders made easy<br/><span style="font-size: 0.8em">the Elpi programming language</span>

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
---

# One language to rule them all!

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

<div class="grid grid-cols-2 gap-12 h-full items-center text-center">
<div>

## OCaml

<div class="h-48 mt-6 flex items-center justify-center">
  <img src="/ocaml-logo.svg" alt="OCaml logo" class="on-white h-24" />
</div>

</div>
<div>

## Elpi

<div class="h-48 mt-6 flex items-center justify-center">
  <img src="/rocq-elpi-logo.png" alt="Elpi logo" class="on-white h-40" />
</div>

</div>
</div>

---
layout: lw-default
level: 2
hideInToc: true
title: Summary
class: lw bg-grid lw-summary
---

# Summary
<Toc minDepth="1" maxDepth="2" />

1. The Elpi programming language
   - logic programming
   - binders H.O.A.S. style
   - Hello World: a type checker for $\lambda_\to$
2. Interfacing Elpi with OCaml
   - the `Conversion.t` data type
   - the `ffi` GADT
   - autmatic glue code: `ppx_elpi`





---
layout: lw-default
class: lw lw-run-side
---

# Logic Programming

<<< @/snippets/logicp.elpi#types elpi {monaco-run}


---
layout: lw-default
---

# binders in HOAS

```elpi

```

---
layout: two-cols-header
level: 2
---

# Elpi: Hello World!

::left::

Simply typed $\lambda$-calculus in $\lambda$-tree syntax (HOAS)

<<< @/snippets/stlc.elpi#types elpi

Typing


````md magic-move

<<< @/snippets/stlc.elpi#of elpi
<<< @/snippets/stlc.elpi#of1 elpi
<<< @/snippets/stlc.elpi#of2 elpi
<<< @/snippets/stlc.elpi#of elpi


````

<br/>
<br/>
<br/>

::right::

````md magic-move {at:1}

```elpi
goal> of (lam x\ lam y\ x) TyFst.
```

```elpi
goal> of (lam x\ lam y\ x) (arr S0 T0).
goal> of        (lam y\ c) T0.
```

```elpi
goal> of (lam x\ lam y\ x) (arr S0 (arr S1 T1)).
goal> of        (lam y\ c) (arr S1 T1).
goal> of                c  T1.
```

```elpi
goal> of (lam x\ lam y\ x) TyFst.

Success:
  TyFst = arr S0 (arr S1 S0)
```

```elpi
goal> of (app H A) T.

Failure.
```

````

---
layout: two-cols-header
level: 2
---

# Elpi = <span class="normal-case">$\lambda$Prolog</span> + CHR

::left::

Typing (as before)

<<< @/snippets/stlc.elpi#of elpi

Holes & constraints

<<< @/snippets/stlc.elpi#cst elpi

<v-click at="6">
Constraint Handling Rules

<<< @/snippets/stlc.elpi#chr elpi
</v-click>

<br/>
<br/>
<br/>


::right::

````md magic-move
```elpi
goal> of (app H A) T.
```

```elpi
goal> of (app H A) T.

Success:

Constraints:
  of A S  /* suspended on A */
  of H (arr S T)  /* suspended on H */
```

```elpi
goal> of (app H A) T, H = (lam x\ x).

Success:

Constraints:
  of A T  /* suspended on A */
```

```elpi
goal> of (app (lam x\ x) A) T.

Success:

Constraints:
  of A T  /* suspended on A */
```

```elpi
goal> of (app D D) T.
```

```elpi
goal> of (app D D) T.

Success:

Constraints:
  of D S  /* suspended on D */
  of D (arr S T)  /* suspended on D */
```

```elpi
goal> of (app D D) T.

Failure
```
````

---
layout: lw-section
---

# Interfacing Elpi with OCaml

---
layout: lw-default
---

# Conversion

```ocaml
module Conversion : sig
  type 'a t = {
    ty : ty_ast;
    pp_doc : Format.formatter -> unit -> unit;
    pp : Format.formatter -> 'a -> unit;
    embed : 'a embedding;   (* 'a -> term *)
    readback : 'a readback; (* term -> 'a *)
  }

module BuiltInData : sig
  val int    : int Conversion.t
  val float  : float Conversion.t
  val string : string Conversion.t
  val list   : 'a Conversion.t -> 'a list Conversion.t
  type diagnostic = OK | ERROR of string
  val diagnostic : diagnostic API.Conversion.t

```

---
layout: lw-default
---

# the `ffi` GADT

```ocaml
type ('function_type, 'inernal_outtype_in, 'internal_hyps, 'internal_constraints) ffi =
    | In    : 't Conversion.t * doc * ('i, 'o,'h,'c) ffi -> ('t -> 'i,'o,'h,'c) ffi
    | Out   : 't Conversion.t * doc * ('i, 'o * 't option,'h,'c) ffi -> ('t -> 'i,'o,'h,'c) ffi
    | Easy : doc -> (depth:int -> 'o, 'o, unit, unit) ffi

type t = Pred : name * ('a,unit,'h,'c) ffi * 'a -> t

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

---
layout: two-cols-header
---

# autmatic glue code: `ppx_elpi`

::left::

```ocaml
type ty = Arr of ty * ty | Int
[@@deriving elpi]

type tctx = CtxEntry of (string[@elpi.key "term"]) * ty
[@@elpi.index (module String)]
[@@deriving elpi]

type term =
  | Var of { name : string } [@elpi.var tctx]
  | App of { fun_ : term; arg : term }
  | Lam of { name : string;
             ty : ty;
             body : (term[@elpi.binder "term" tctx
                        (fun name ty -> CtxEntry (name, ty))]) }
[@@deriving elpi]
```

::right::

```elpi {monaco}
builtin data ty.
builtin symb arr : ty -> ty -> ty = "0".  % Arr
builtin symb int : ty = "0".  % Int

builtin func ctxentry term -> string, ty.


builtin data term.
builtin symb app : term -> term -> term = "0".  % App
builtin symb lam : string -> ty -> (term -> term) -> term = "0".  % Lam


```

---
layout: lw-section
---

# The integration in Rocq


---
layout: image-right
image: readme.png
backgroundSize: 80%
transition: fade
level: 2
---

# Notable features

- HOAS for Gallina
- quotations and anti-quotations

  ![Quotations](/quote.png "quote")

- Databases of rules
- Extensive API

  ![API example](/api.png "api")


---
layout: two-cols-header
transition: fade
level: 2
---

# Integration with Rocq: from Prop to bool (1/3)

:: left ::

````md magic-move

```coq
Inductive is_even : nat -> Prop := ...

Fixpoint even (n : nat) : bool := ...

Lemma evenP n : reflect (is_even n) (even n).


Lemma andP  {P Q : Prop} {p q : bool} :
  reflect P p -> reflect Q q ->
    reflect (P /\ Q) (p && q).


Lemma elimT {P b} : reflect P b -> b = true -> P.

Lemma test : is_even 6 /\ is_even 4.
Proof.
  refine (elimT (andP (evenP 6) (evenP 4)) _).


  (* even 6 && even 4 = true *)
  simpl. trivial.
Qed.
```

```coq
Inductive is_even : nat -> Prop := ...

Fixpoint even (n : nat) : bool := ...

Lemma evenP n : reflect (is_even n) (even n).


Lemma andP  {P Q : Prop} {p q : bool} :
  reflect P p -> reflect Q q ->
    reflect (P /\ Q) (p && q).


Lemma elimT {P b} : reflect P b -> b = true -> P.

Lemma test : is_even 6 /\ is_even 4.
Proof.
  (* refine (elimT (andP (evenP 6) (evenP 4)) _). *)
  to_bool.

  (* even 6 && even 4 = true *)
  simpl. trivial.
Qed.
```

````

:: right ::

---
layout: two-cols-header
transition: fade
level: 2
---

# Integration with Rocq: from Prop to bool (2/3)

:: left ::

```coq
Inductive is_even : nat -> Prop := ...

Fixpoint even (n : nat) : bool := ...

Lemma evenP n : reflect (is_even n) (even n).


Lemma andP  {P Q : Prop} {p q : bool} :
  reflect P p -> reflect Q q ->
    reflect (P /\ Q) (p && q).


Lemma elimT {P b} : reflect P b -> b = true -> P.

Lemma test : is_even 6 /\ is_even 4.
Proof.
  (* refine (elimT (andP (evenP 6) (evenP 4)) _). *)
  to_bool.

  (* even 6 && even 4 = true *)
  simpl. trivial.
Qed.
```

:: right ::

```coq
(* [tb P R] finds R : reflect P _ *)
Elpi Tactic to_bool.
Elpi Accumulate lp:{{
  func tb term -> term.
  tb {{ is_even lp:N }} {{ evenP lp:N }}.
  tb {{ lp:P /\ lp:Q }} {{ andP lp:PP lp:QQ }} :- tb P PP, tb Q QQ.

  solve (goal _ _ Ty _ _ as G) GL :-
    tb Ty P, refine {{ elimT lp:P _ }} G GL.              }}.
```


---
layout: two-cols-header
transition: fade
level: 2
---

# Integration with Rocq: from Prop to bool (3/3)

:: left ::

```coq
Inductive is_even : nat -> Prop := ...
Fixpoint even (n : nat) : bool := ...

Lemma evenP n : reflect (is_even n) (even n).
Register evenP.
(* tb {{ is_even lp:N }} {{ evenP lp:N }} *)

Lemma andP  {P Q : Prop} {p q : bool} :
  reflect P p -> reflect Q q ->
    reflect (P /\ Q) (p && q).
Register andP.
(* tb {{ lp:P /\ lp:Q }} {{ andP lp:PP lp:QQ }} :- 
     tb P PP, tb Q QQ. *)

Lemma elimT {P b} : reflect P b -> b = true -> P.
Lemma test : is_even 6 /\ is_even 4.
Proof.
  (* refine (elimT (andP (evenP 6) (evenP 4)) _). *)
  to_bool.

  (* even 6 && even 4 = true *)
  simpl. trivial.
Qed.
```

:: right ::

````md magic-move

```coq
(* [tb P R] finds R : reflect P _ *)
Elpi Db tb.db lp:{{ func tb term -> term. }}.

Elpi Tactic to_bool.
Elpi Accumulate Db tb.db.
Elpi Accumulate lp:{{
  solve (goal _ _ Ty _ _ as G) GL :-
    tb Ty P, refine {{ elimT lp:P _ }} G GL.              }}.

Elpi Command Register.
Elpi Accumulate Db tb.db.
Elpi Accumulate lp:{{
  func compile term, term, list prop -> prop.

  main [str S] :-
    coq.locate S GR,
    coq.env.typeof GR Ty,
    compile Ty (global GR) [] C,
    coq.elpi.accumulate _ "tb.db" (clause _ _ C).        }}.

```

```elpi
% [compile Ty R Hyps C] invariant R : Ty
func compile term, term, list prop -> prop.

compile {{ reflect lp:P _ }} R Todo (tb P R :- Todo).

compile {{ reflect lp:S _ -> lp:Ty }} R Todo (pi h\ C h) :- !,
  pi h\ compile Ty {{ lp:R lp:h }} [tb S h|Todo] (C h).

compile {{ forall x, lp:(Ty x) }} R Todo (pi x\ C x) :-
  pi x\ compile (Ty x) {{ lp:R lp:x }} Todo (C x).
```

```elpi
% [compile Ty R Hyps C] invariant R : Ty
func compile term, term, list prop -> prop.

compile {{ reflect lp:P _ }} R Todo (tb P R :- Todo).

compile {{ reflect lp:S _ -> lp:Ty }} R Todo (pi h\ C h) :- !,
  pi h\ compile Ty {{ lp:R lp:h }} [tb S h|Todo] (C h).

compile {{ forall x, lp:(Ty x) }} R Todo (pi x\ C x) :-
  pi x\ compile (Ty x) {{ lp:R lp:x }} Todo (C x).

% compile {{ forall n, reflect (is_even n) (even n) }} {{ evenP }} []
%   (pi n\ tb {{ is_even lp:n }} {{ evenP lp:n }} :- [])
```

```elpi
% [compile Ty R Hyps C] invariant R : Ty
func compile term, term, list prop -> prop.

compile {{ reflect lp:P _ }} R Todo (tb P R :- Todo).

compile {{ reflect lp:S _ -> lp:Ty }} R Todo (pi h\ C h) :- !,
  pi h\ compile Ty {{ lp:R lp:h }} [tb S h|Todo] (C h).

compile {{ forall x, lp:(Ty x) }} R Todo (pi x\ C x) :-
  pi x\ compile (Ty x) {{ lp:R lp:x }} Todo (C x).

% compile {{ forall n, reflect (is_even n) (even n) }} {{ evenP }} []
%   (pi n\ tb {{ is_even lp:n }} {{ evenP lp:n }} :- [])

% compile {{ forall P Q p q, reflect P p -> reflect Q q ->
%              reflect (P /\ Q) (p && q) }} {{ andP }} []
%   (pi P Q p q PP QQ\
%        tb {{ lp:P /\ lp:Q }} {{ andP lp:PP lp:QQ }} :-
%           [tb Q QQ, tb P PP])
```

````


---
layout: lw-section
---

# The good company

https://github.com/rocq-community/metaprogramming-rosetta-stone

---
transition: fade
zoom: 0.75
level: 2
---

# Comparison

<table>

<thead>
<tr style="border-bottom-width: 4px"> <th></th> <th>Elpi</th> <th>Ltac2</th> <th>MetaRocq</th> </tr>
</thead>
<tbody>

<tr> <td>Gallina</td>
  <td>
    <icon-park-twotone-pie-seven/>
    <br/><small>no mutual fix/ind</small>
  </td>
  <td>
    <icon-park-twotone-round/>
  </td>
  <td>
    <icon-park-twotone-round/>
  </td>
</tr>

<tr> <td>Bound Variables</td>
  <td>
    <icon-park-twotone-round/>
  </td>
  <td>
    <icon-park-twotone-pie-three/>
    <br/><small>quotations</small>

  </td>
  <td>
    <icon-park-twotone-pie-one/>
    <br/><small>toplevel quotation</small>
  </td>
</tr>

<tr style="border-bottom-width: 4px"> <td>Holes</td>
  <td>
    <icon-park-twotone-round/>
  </td>
  <td>
    <icon-park-twotone-pie-five/>
    <br/><small>tactic monad</small>

  </td>
  <td>
    <icon-park-twotone-pie-one/>
    <br/><small>only AST</small>
  </td>
</tr>

<tr> <td>Proof API</td>
  <td>
    <icon-park-twotone-pie-four/>
    <br/><small>weak ltac1 bridge</small>
  </td>
  <td>
    <icon-park-twotone-round/>
    <br/><small>(sufficiently close)</small>
  </td>
  <td>
    <icon-park-twotone-pie-one/>
    <br/><small>only TC search, obligations</small>
  </td>
</tr>

<tr style="border-bottom-width: 4px"> <td>Vernacular API</td>
  <td>
    <icon-park-twotone-pie-seven/>
    <br/><small>no notations, obligations</small>
  </td>
  <td>
    <material-symbols-circle-outline/>
  </td>
  <td>
    <icon-park-twotone-pie-three/>
    <br/><small>only env, obligations</small>
  </td>
</tr>

<tr style="border-bottom-width: 4px"> <td>Elaborator API</td>
  <td>
    <icon-park-twotone-pie-six/>
    <br/><small>no error locations</small>
  </td>
  <td>
    <material-symbols-circle-outline/>
  </td>
  <td>
    <material-symbols-circle-outline/>
  </td>
</tr>


<tr style="border-bottom-width: 4px"> <td>Reasoning logic</td>
  <td>
    <icon-park-twotone-pie-one/>
    <br/><small>Abella</small>
  </td>
  <td>
    <material-symbols-circle-outline/>
  </td>
  <td>
    <icon-park-twotone-pie-six/>
    <br/><small>no holes, unif</small>
  </td>
</tr>

</tbody>
</table>

To the best of my knowledge, on 1/1/2026 {style="text-align:center"}


---
layout: lw-section
---

# What makes me proud


---
layout: two-cols-header
level: 2
---

# Hierarchy Builder

<div class="authors">

![CohenCyril](/avatars/CohenCyril.jpg)
![pi8027](/avatars/pi8027.jpg)
![gares](/avatars/gares.jpg)
![proux01](/avatars/proux01.jpg)
![ThomasPortet](/avatars/ThomasPortet.jpg)
![affeldt-aist](/avatars/affeldt-aist.jpg)
<!--
![FissoreD](/avatars/FissoreD.jpg)
![SkySkimmer](/avatars/SkySkimmer.jpg)
![thery](/avatars/thery.jpg)
![Tvallejos](/avatars/Tvallejos.jpg)
![VojtechStep](/avatars/VojtechStep.jpg)
![ybertot](/avatars/ybertot.jpg)
-->

</div>

DSL to declare a hierarchy of interfaces

:: left ::

* generates boilerplate via Elpi's API: modules, implicit arguments, canonical structures, ... 
* used by the Mathematical Components library and other ~20 libraries
* makes "packed classes" easy

  ![MC](/hb_intf.png "number of interfaces"){style="width: 80%"}

  2017
  <span style="width:8em; display:inline-block"/>
  2022
  <span style="width:2em; display:inline-block"/>
  2024

:: right ::

```coq
From HB Require Import structures.

HB.mixin Record IsAddComoid A := {
  zero : A;
  add : A -> A -> A;
  addrA : forall x y z, add x (add y z) = add (add x y) z;
  addrC : forall x y, add x y = add y x;
  add0r : forall x, add zero x = x;
}.

HB.structure Definition AddComoid := { A of IsAddComoid A }.

Notation "0" := zero.
Infix "+" := add.

Check forall (M : AddComoid.type) (x : M), x + x = 0.
```

<!--
this is the command / this is the argument

uses the APIs to declare modules, coercions, implicit arguments

--
layout: two-cols-header
level: 2
--

# Trocq

<div class="authors">

![ecranceMERCE](/avatars/ecranceMERCE.jpg)
![amahboubi](/avatars/amahboubi.jpg)
![CohenCyril](/avatars/CohenCyril.jpg)
<!-- ![palmskog](/avatars/palmskog.jpg) -- >

</div>

Proof transfer via parametricity (with or without univalence).

:: left ::

<div style="padding-right: 3em">


- Registers in Elpi Databases translation rules
- Synthesizes transfer proofs minimizing the axioms required

</div>

:: right :: 

<div style="transform: scale(1.2)">

```coq 
From Trocq Require Import Trocq.

Definition RN : (N <=> nat)%P := ...
Trocq Use RN.

Lemma RN0 : RN 0%N 0%nat. ...
Lemma RNS m n : RN m n -> RN (N.succ m) (S n). ...
Trocq Use RN0 RNS.

Lemma N_Srec : ∀P : N -> Type, P 0%N ->
    (∀n, P n -> P (N.succ n)) -> ∀n, P n.
Proof.
trocq. (* replaces N by nat in the goal *)
exact nat_rect.
Qed.
```

</div>

--
layout: two-cols-header
level: 2
--

# Derive

<div class="authors">

![gares](/avatars/gares.jpg)
![CohenCyril](/avatars/CohenCyril.jpg)
![bgregoir](/avatars/bgregoir.jpg)
![eponier](/avatars/eponier.jpg)
![Blaisorblade](/avatars/Blaisorblade.jpg)
![rlepigre](/avatars/rlepigre.jpg)
![dwarfmaster](/avatars/dwarfmaster.jpg)
<!--
![artagnon](/avatars/artagnon.jpg)
![ecranceMERCE](/avatars/ecranceMERCE.jpg)
![ejgallego](/avatars/ejgallego.jpg)
![FissoreD](/avatars/FissoreD.jpg)
![herbelin](/avatars/herbelin.jpg)
![jfehrle](/avatars/jfehrle.jpg)
![maximedenes](/avatars/maximedenes.jpg)
![pedrotst](/avatars/pedrotst.jpg)
![phikal](/avatars/phikal.jpg)
![pi8027](/avatars/pi8027.jpg)
![ppedrot](/avatars/ppedrot.jpg)
![proux01](/avatars/proux01.jpg)
![robblanco](/avatars/robblanco.jpg)
![SimonBoulier](/avatars/SimonBoulier.jpg)
![SkySkimmer](/avatars/SkySkimmer.jpg)
![Tragicus](/avatars/Tragicus.jpg)
![vbgl](/avatars/vbgl.jpg)
![VojtechStep](/avatars/VojtechStep.jpg)
![wdeweijer](/avatars/wdeweijer.jpg)
![whonore](/avatars/whonore.jpg)
![ybertot](/avatars/ybertot.jpg)
![yoichi-at-bedrock](/avatars/yoichi-at-bedrock.jpg)
![Zimmi48](/avatars/Zimmi48.jpg)
- ->

</div>

Framework for type driven code synthesis

:: left ::

<div style="padding-right: 3em">

Derivations:
- parametricity
- deep induction
- equality tests and proofs
- lenses (record update syntax)
- a few more...

</div>

:: right :: 

<div style="transform: scale(1.2)">

```coq
From elpi.apps Require Import derive.std lens.

#[only(lens_laws, eqb), module] derive
Record Box A := { contents : A; tag : nat }.

About Box. (* Notation Box := Box.t *)

Check Box.eqb :
  ∀A, (A -> A -> bool) -> Box A -> Box A -> bool.

(* the Lens for the second field *)
Check @Box._tag : ∀A, Lens (Box A) (Box A) nat nat.

(* a Lens law *)
Check Box._tag_set_set : ∀A (r : Box A) y x,
  set Box._tag x (set Box._tag y r) = set Box._tag x r.
```

</div>


--
layout: two-cols-header
level: 2
--

# Algebra Tactics

<div class="authors">

![pi8027](/avatars/pi8027.jpg)
![proux01](/avatars/proux01.jpg)
![amahboubi](/avatars/amahboubi.jpg)
<!-- ![CohenCyril](/avatars/CohenCyril.jpg)
![gares](/avatars/gares.jpg) -- >

</div>

`ring`, `field`, `lra`, `nra`, and `psatz` tactics for the Mathematical Components library. 

:: left ::

- works with any instance of the structure: concrete, abstract and mixed
  like `int * R` where `R` is a variable
- automatically push down ring morphisms and additive functions to
  leaves of the expression
- reification up to instance unification in Elpi


:: right ::

```coq
From mathcomp Require Import all_ssreflect.
From mathcomp Require Import all_algebra.
From mathcomp Require Import ring lra.

Lemma test (F : realFieldType) (x y : F) :
  x + 2 * y <= 3 ->
  2 * x + y <= 3 ->
    x + y <= 2.
Proof. lra. Qed.

Variables (R : unitRingType) (x1 x2 x3 y1 y2 y3 : R).
Definition f1 : R := ...
Definition f2 : R := ...
Definition f3 : R := ...

(* 500 lines of polynomials later... *)

Lemma example_from_Sander : f1 * f2 = f3.
Proof. rewrite /f1 /f2 /f3. ring. Qed.
```


--
layout: lw-section
--

# Elpi in a nutshell

https://github.com/LPCIC/elpi/

--
layout: two-cols-header
image: vespa.png
backgroundSize: 80%
level: 2
--

# Rules, rules, rules!{style="text-align:center"}


:: left ::


## Roots

- Elpi is a constraint logic programming language
- Elpi is a dialect of λProlog and CHR
- backtracking is not the point

<br/>

## What really matters

- Code is organized in rules
- Rule application is guided by a pattern
- Rules can be added statically and dynamically



:: right ::

## <icon-park-twotone-caution/> Vintage syntax ahead

<ul>
<li><p>variables are capitals
<force-inline>
```elpi
X
```
</force-inline>
</p></li>

<li><p> λx.t  is written
<force-inline>
```elpi
x\ t
```
</force-inline>
</p></li>

<li><p>rules are written
<force-inline>
```elpi
goal :- subgoal1, subgoal2...
```
</force-inline>
</p></li>

</ul>



--
layout: lw-section
transition: fade
--

# Integration in Rocq

https://github.com/LPCIC/coq-elpi/
-->


---
layout: lw-section
---

# Conclusion

---
layout: default
level: 2
---

# Elpi: take home

<br/>

## Extension language
  - Use a language (ony) when it is a good fit
  
## Rule-based is a good fit for
  - HOAS (binders and local context)
  - prover logical environment (global context)
  - (meta) meta programming (homoiconicity)


---
layout: default
level: 2
---

# Perspectives - Elpi takes advantage of Rocq

- Mechanization of Elpi in Rocq (durability)
  - operational semantics of $\lambda$Prolog + cut (done, by Fissore)
  - determinacy analysis (control part done, HO part ongoing)
  - term representation, unifier (todo and scary)
- Mechanization of $\mathcal{G}$ in Rocq 
  - metatheory of $\mathcal{G}$ (warming up)
  - proofs about Elpi code in Rocq


---
layout: default
level: 2
---

# Perspectives - Rocq takes advantage of Elpi

- Rocq-Elpi into Rocq proper (use Elpi in lower layers)
  - need HOAS encoding for mutual fixpoints (and mutual inductive types)
  - functional (rule based) syntax could be more familiar to Rocq users
  - user manual definitely needed
- Memoization (tabling via SLG)
  - no good public benchmark, but BedRock/BlueRock/SkyLabs-AI needs it
  - loop detection could help beginners

---
layout: two-cols-header
image: logo.png
backgroundSize: 80%
level: 2
title: Thanks
---

# Thanks for contributing code! {style="text-align:center"}

<div style="text-align:center">

https://github.com/LPCIC/elpi/

</div>

:: right ::

<div class="vauthors">


<br/>

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

Pedro Abreu, Yves Bertot, Frederic Besson, Rob Blanco, Simon Boulier, Luc Chabassier, Cyril Cohen, Enzo Crance, Maxime Dénès, Jim Fehrle, Davide Fissore, Paolo G. Giarrusso, Gaëtan Gilbert, Benjamin Gregoire, Hugo Herbelin, Yoichi Hirai, Jasper Hugunin, Emilio Jesus Gallego Arias, Jan-Oliver Kaiser, Philip Kaludercic, Chantal Keller, Vincent Laporte, Jean-Christophe Léchenet, Rodolphe Lepigre, Karl Palmskog, Pierre-Marie Pédrot, Ramkumar Ramachandra, Pierre Roux, Pierre Roux, Claudio Sacerdoti Coen, Kazuhiko Sakaguchi, Matthieu Sozeau, Gordon Stewart, David Swasey, Alexey Trilis, Quentin Vermande, Théo Zimmermann, wdewe, whonore 

</div>


---
layout: two-cols-header
image: logo.png
backgroundSize: 80%
level: 2
title: Thanks
---

# Thanks for support and motivation! {style="text-align:center"}


:: right ::

<div class="vfamily">

![anna](./public/anna.jpg){style="object-fit: contain;"}

</div>

:: left ::

<div class="vfamily">

![cinzia](./public/cinzia.jpeg){style="width: 85%"}

</div>

---
layout: lw-end
level: 2
title: Thanks
---

# Thanks for listening! {style="text-align:center"}



