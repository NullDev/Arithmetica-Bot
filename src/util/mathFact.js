// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const facts = [
    "All abelian groups are solvable.",
    "The only factorial that's also a square is 1.",
    "The semi-direct product of two abelian groups may be non-abelian.",
    "The diagonal elements of a complex Hermitian matrix are all real.",
    "Every group of prime order is cyclic.",
    "Every subgroup of a cyclic group is cyclic.",
    "In a commutative ring with identity, every maximal ideal is prime.",
    "The final digits of the Fibonacci sequence have period 60.",
    "Representations of compact topological groups are semi simple.",
    "Every Polish space is homeomorphic to a subspace of the Hilbert cube.",
    "A holomorphic function of two or more complex variables has no isolated zeros.",
    "If p is prime, every group of order p² is abelian.",
    "Fermat's last theorem does not apply to integer matrices of size > 1.",
    "The characteristic of a field is either 0 or a prime.",
    "The derivative of a Bézier curve is another Bézier curve.",
    "In linear logic, multiplicative operators can be understood as context-free and additive operators as contextual.",
    "A monad is just a monoid in the category of endofunctors.",
    "In the category of Abelian groups, direct sum is both a product and a coproduct.",
    "Laplace transforms turn differential equations into algebraic equations.",
    "The set of all algebraic numbers is countable.",
    "The set of all transcendental numbers is uncountable.",
    "If X is a set of Borel measure zero, not every subset of X must be Borel measurable. But every subset of X is Lebesgue measurable.",
    "A projective plane has Euler characteristic 1.",
    "The Euler characteristics of a torus and a Klein bottle are both 0.",
    "There are 8 semi-regular (Archimedean) tessellations.",
    "A space is simply connected if its fundamental group is trivial.",
    "A space is connected if it has no proper subsets that are both open and closed.",
    "All abelian simple groups are cyclic groups of prime order.",
    "Convex polygons of more than 6 sides cannot tessellate.",
    "The uniform limit of continuous functions is continuous.",
    "The fundamental group of the product of two spaces is the direct product of their fundamental groups.",
    "In Euclidean spaces, an open connected subset of the complex plane is path connected.",
    "The fundamental group of a projective plane P² has order 2.",
    "The product of regular spaces is regular.",
    "The product of Hausdorff spaces is Hausdorff.",
    "A metric space X is complete if every Cauchy sequence in X converges to a point in X.",
    "The product of path connected spaces is path connected.",
    "A space is connected if it is not the union of disjoint open sets.",
    "A field is a commutative division ring. In other words, it is an object in the category of rings such that every epimorphism from it is either an isomorphism or a morphism to a terminal object.",
    "A category is the horizontal categorification of a monoid.",
    "In a category with biproducts, there is a decomposition of any morphism in terms of arrays of morphisms between each object's summands. This array is called a matrix.",
    "The axiom of choice states that every non-empty set admits a group structure.",
    "A Lie group is a manifold and a group.",
    "An n x n matrix with n distinct eigenvalues is diagonalizable.",
    "The determinant of a matrix is the product of its eigenvalues.",
    "A group is called simple if it has no normal subgroups other than the identity and the group itself.",
    "All cyclic groups are Abelian, but an Abelian group is not necessarily cyclic.",
    "It is unknown whether odd perfect numbers exist.",
    "The sum of the reciprocals of the primes diverges.",
    "Every positive integer can be written as a sum of distinct Fibonacci numbers.",
    "Every permutation can be written as a product of disjoint cycles.",
    "In a group G, the order of any element is a divisor of the order of G.",
    "If matrices A and B commute, then they have a common eigenvector.",
    "For each prime p and positive integer n, there is a unique field of order p^n.",
    "All finite division rings are commutative and therefore finite fields.",
    "Every field is an integral domain. Every finite integral domain is a field.",
    "The sum of Hermitian matrices is Hermitian.",
    "If p and q are prime, every group of order p^m q^n is solvable.",
    "There are no non-abelian simple groups of order less than 60.",
    "Any two finite fields having exactly p^n elements for prime p are isomorphic.",
    "In the category of Abelian groups, coproducts are direct sums.",
    "In the category of groups, coproducts are free products.",
    "Every positive integer is the sum of four squares. If n is congruent to 7 mod 8 then n is not a sum of three squares.",
    "The only number > 1 that is square and pyramidal is 4900.",
    "An algebraically closed field must be infinite.",
    "The order of a finite field must be a prime power.",
    "If a polynomial has real coefficients, complex roots come in conjugate pairs.",
    "The operation of putting a matrix into Jordan canonical form is discontinuous.",
    "Every ring homomorphism from a field to a non-zero ring is injective.",
    "The Riemann zeta function at positive even integers takes on values that are rational multiples of even powers of pi.",
    "A space is sequentially compact if every sequence has a convergent subsequence.",
    "Finite products of locally compact spaces are locally compact.",
    "The image of a compact set under a continuous function is compact.",
    "A compact subset of a Hausdorff space is closed.",
    "A compact Hausdorff space is normal.",
    "A closed subgroup of a Lie group is a submanifold.",
    "A closed subset of a compact space is compact.",
    "A function between two topological spaces is continuous if the inverse image of every open set is open.",
    "A closed subset of a normal space is normal.",
    "The field of p-adic numbers has a totally disconnected topology.",
    "A space is second countable if it has a countable basis.",
    "A space is separable if it contains a countable dense subset.",
    "A Hausdorff space is normal if every disjoint pair of closed sets can be separated by disjoint open sets.",
    "A complex elliptic curve is topologically a torus.",
    "An elliptic curve over a finite field is either a cyclic group or the product of two cyclic groups.",
    "Every non-reflexive Banach space contains two disjoint closed bounded convex sets which cannot be separated by a closed hyperplane.",
    "In calculus over the p-adic numbers, a function can have derivative zero without being constant.",
    "Weierstrass elliptic functions have one singularity of order 2 inside the fundamental parallelogram.",
    "A holomorphic function of two or more complex variables has no isolated zeros.",
    "A functor is called exact if it preserves short exact sequences.",
    "A functor is called faithful if it is injective on hom-sets.",
    "Every commutative monoid can be extended to a group.",
    "A ring R is Noetherian if every ideal of R is finitely generated.",
    "In the category of rings, an epimorphism is not necessarily surjective. Unlike sets and groups.",
    "Every finite abelian group is the direct sum of its nontrivial Sylow subgroups.",
    "A group G is simple if its only normal subgroups are the identity and G itself.",
    "The Krull dimension of a commutative ring R is the length of the longest chain of prime ideals in R.",
    "Every element in a finite field can be written as the sum of at most two squares.",
    "A group is solvable if every factor in its composition series is cyclic.",
    "An algebraic number field is a finite degree extension of the rationals.",
    "The nth prime is greater than n log n.",
    "The only Fibonacci numbers that are cubes are 1 and 8.",
    "Every odd integer n ≥ 7 is the sum of three primes.",
    "Every invertible complex matrix is the exponential of some complex matrix.",
    "Every finite field is a splitting field of a polynomial.",
    "A local ring is a ring that has exactly one maximal ideal.",
    "An elliptic curve can have only a finite number of points with integer coordinates.",
    "Every Boolean algebra is isomorphic to a field of sets.",
    "The ideals of a ring form a semiring.",
    "A wheel is an algebraic structure that is the equivalent of a commutative ring (and semiring) where addition and multiplication are not a group but respectively a commutative monoid and a commutative monoid with involution.",
    "For elliptic curves, it's easier to prove that addition is commutative than to prove it is associative.",
    "A real matrix has orthogonal eigenvectors if and only if it commutes with its transpose.",
    "The word “hundred” comes from the old Norse term, “hundrath”, which actually means 120 and not 100.",
    "The symbol for division (÷) is called an obelus.",
    "The symbol for infinity (∞) is called a lemniscate.",
    "A ring is a monoid internal to (Ab, ⊗, ℤ).",
    "A group is a groupoid with a single object.",
    "A groupoid is a category in which every morphism is invertible (an isomorphism).",
    "A category is called small if the collections of its objects and morphisms are sets.",
    "A monoid in a monoidal category is the categorical generalisation of a monoid.",
    "The sum of any two odd numbers or any two even numbers is an even number.",
    "0.999... is _exactly_ equal to 1. Not _approximately equal_, instead, they represent the very same number.",
    "An order preserving map on a complete lattice has a fixed point.",
    "A matrix is invertible if and only if its determinant is non-zero.",
    "The sum of the first n odd numbers is n².",
    "In topology, a coffee mug and a donut are homotopically equivalent",
    "A group is called simple if it has no normal subgroups other than the trivial group and the group itself.",
    "The number of subsets of a set with n elements is 2^n.",
    "In an infinite set, the number of elements and the number of subsets of those elements are incomparable.",
    "In a finite group, the number of elements that are their own inverses is always even.",
    "A number is divisible by 9 if and only if the sum of its digits is divisible by 9.",
    "A cyclic group of prime order has only the trivial group as a proper subgroup.",
    "The j-invariant of _i_ is 1728.",
];

/**
 * Get a random math fact
 *
 * @return {String}
 */
const getRandomMathFact = function(){
    return facts[Math.floor(Math.random() * facts.length)];
};

export default getRandomMathFact;
