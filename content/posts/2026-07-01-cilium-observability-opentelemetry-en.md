---
title: 'Cilium, observability, and where OpenTelemetry fits in a low-load cluster'
date: '2026-07-01'
status: published
privacy: public
lang: en
tags:
  - cilium
  - kubernetes
  - observability
  - opentelemetry
  - hubble
  - ebpf
  - gitops
  - prometheus
  - devops
repos: []
skills: []
patterns: []
relatedTo: []
description: >-
  Weighing Cilium for a low-load multiservice cluster when the real
  requirements are observability, centralization, and in-code config — and
  placing Hubble, Prometheus/Grafana, GitOps, and OpenTelemetry in the stack.
---

> Published as-is, no translation. An architecture conversation: is Cilium worth it at low load, how it maps to an observability-first, in-code stack, and exactly where OpenTelemetry belongs.

## Cost/benefit of Cilium at low load

> cost benefit of using cilium in a low load multiservice cluster?

Short answer: for a low-load multiservice cluster, Cilium's marginal benefit is small and its complexity cost is real. It pays off only if you specifically need eBPF-level features, not for baseline "cluster works" needs.

### Benefits (weighted by low-load relevance)

- **L3/L4/L7 network policies** — Cilium's real differentiator. Identity-based (not IP-based) policy, plus L7-aware rules (HTTP verbs, gRPC methods, Kafka topics). Useful for a multiservice mesh even at low load if you want fine-grained segmentation. This is the main reason to pick it.
- **kube-proxy replacement** — eBPF-based service routing avoids iptables scaling issues. At low load this is negligible; iptables only degrades at thousands of services/endpoints.
- **Hubble observability** — flow-level visibility, service maps, DNS/L7 visibility without sidecars. Genuinely nice for debugging multiservice interactions, and low-load clusters can afford to run it.
- **Performance** — eBPF datapath beats iptables-based CNIs on throughput/latency. Irrelevant at low load; you won't hit the ceilings that make this matter.
- **Cilium Service Mesh** (sidecarless mTLS, L7 routing) — can replace Istio/Linkerd sidecars, saving per-pod overhead. Relevant if you'd otherwise deploy a sidecar mesh.

### Costs

- **Operational complexity** — steeper learning curve than Flannel/Calico-basic. eBPF debugging, kernel version sensitivity, more moving parts (Cilium agent, operator, optionally Hubble relay/UI). This is the dominant cost for a small setup.
- **Kernel/version dependency** — needs a reasonably modern kernel (5.x+ for full feature set). Managed offerings (GKE Dataplane V2, EKS, AKS) reduce this friction; self-managed increases it.
- **Resource footprint** — the agent per node plus operator plus Hubble is heavier than Flannel. On a small cluster this is a proportionally larger tax, though still modest in absolute terms.
- **Overkill risk** — most eBPF advantages are throughput/scale features you won't exercise. You pay complexity for headroom you don't use.

### Assessment

Low load removes the performance argument almost entirely. The decision reduces to: do you want identity-based/L7 network policy and Hubble observability enough to absorb the operational overhead? If yes, Cilium is justified even at low load. If you just need working pod networking and basic policy, Calico (or Flannel + Calico policy) gives you 80% of the practical value at lower operational cost.

Two things that change the calculus toward Cilium: (1) you're on a managed platform where it's the default dataplane (GKE Dataplane V2, etc.), so the operational cost is largely absorbed by the provider; (2) you're planning to grow, and want to avoid a CNI migration later — migrations are painful, so choosing Cilium early can be rational even if under-utilised now.

This is engineering judgement rather than filtered evidence — there's no RCT-tier data here, and public benchmarks are mostly vendor- or blog-sourced with the usual selection bias.

## Requirements: observability, centralized, in-code

> we want observability (network, ingress, ...), centralized, in-code config

Given those three requirements, Cilium becomes a stronger fit — but "in-code config" is the axis that actually decides the shape of your stack, and Cilium alone doesn't fully cover it.

### Mapping requirements to Cilium

- **Network observability** — Hubble covers this well. Flow-level L3/L4/L7 visibility, DNS resolution, service dependency maps, drops with policy verdicts. Exports to Prometheus/OpenTelemetry, and Hubble UI gives the service map. This is Cilium's strongest observability card.
- **Ingress observability** — partial. Cilium can act as your Ingress/Gateway API implementation (Cilium Ingress Controller, Gateway API support), and then Hubble sees that L7 traffic natively. If you keep a separate ingress (NGINX, Traefik, Envoy Gateway), you lose the unified Hubble view of ingress internals and fall back to that controller's own metrics. So the clean path is Cilium-as-ingress to get ingress into the same observability plane.
- **Centralized** — Hubble Relay aggregates flows cluster-wide; Hubble metrics → Prometheus → Grafana is the standard centralised pipeline. For logs/traces you still need the rest of the stack (below). Cilium centralises network telemetry, not your whole observability estate.
- **In-code config** — this is where Cilium is necessary but not sufficient. `CiliumNetworkPolicy`, `CiliumEnvoyConfig`, Gateway/Ingress objects are all CRDs, so they're declarative and GitOps-friendly. But your observability stack (Prometheus, Grafana dashboards, Hubble config, ingress routes) is what you actually want in code, and that's a GitOps concern, not a Cilium feature.

### What the full picture looks like

For "centralized + in-code" observability across network and ingress, Cilium is one layer of three:

1. **Datapath + network/ingress telemetry** — Cilium + Hubble, with Cilium serving Gateway API so ingress lands in the same plane.
2. **Telemetry backend** — Prometheus (metrics), Loki or equivalent (logs), Tempo/Jaeger (traces if you want distributed tracing), Grafana as the single pane. Hubble feeds metrics/flows in; ingress metrics land here too.
3. **In-code delivery** — everything above defined as manifests/Helm values in Git, reconciled by Argo CD or Flux. This is what makes it "in-code and centralized" rather than clicked-together. Cilium's config being CRD-based is what lets it participate cleanly here.

### The honest gap

Cilium gives you network and Cilium-served-ingress observability as code. It does **not** give you application-level tracing, log aggregation, or a unified dashboard — you assemble those. If "observability" in your requirement includes app traces and logs, the decision isn't "Cilium yes/no" but "Cilium + Prometheus/Grafana/Loki/Tempo, all GitOps-managed."

### Recommendation

At low load with these requirements, Cilium is justified — the observability and Gateway-API-as-code story is exactly what it's good at, and low load means the operational overhead is your main cost, not performance tuning. Concretely:

- Cilium as CNI + kube-proxy replacement, with Hubble enabled (Relay + metrics export).
- Cilium serving Gateway API so ingress traffic is visible in Hubble and configured as CRDs.
- Prometheus + Grafana (+ Loki/Tempo if you need logs/traces) as the centralised backend.
- Argo CD or Flux so the whole thing — Cilium Helm values, network policies, Gateway routes, dashboards — lives in Git.

Two decisions I can't make for you without more input: whether you need distributed tracing (changes whether you add Tempo/Jaeger and instrument apps), and managed vs self-managed (managed platforms with Cilium as default dataplane cut the operational cost substantially).

## Where OpenTelemetry fits

> where opentelemetry would fit in this stack?

OpenTelemetry sits at the **instrumentation and transport layer** — it's the vendor-neutral pipe that carries telemetry from sources to backends. It doesn't replace Cilium/Hubble or Prometheus/Grafana; it standardises how signals get produced and moved between them. Placing it correctly matters because it overlaps partially with Hubble and Prometheus, and getting the boundaries wrong means duplicated pipelines.

### The three OTel pieces

- **SDKs/APIs (instrumentation)** — libraries in your application code that emit traces, metrics, and logs in OTLP format. This is the layer nothing else in your stack provides: Hubble sees network flows, not what your app is doing internally. If you want distributed tracing across your multiservice calls, this is where it comes from.
- **Auto-instrumentation** — for supported languages, injected via an operator without code changes. Gets you spans for HTTP/gRPC/DB calls "for free," though hand-instrumentation gives richer spans.
- **Collector** — the centralising hub. Receives OTLP (and other formats), processes (batch, filter, enrich, tail-sample), and exports to your backends. This is the piece that makes "centralized" real at the telemetry-pipeline level.

### Where each layer plugs in

Mapping onto the stack from the previous section:

- **Cilium + Hubble** — network/ingress flows. Hubble can export to OTel: Hubble → OTLP → Collector, so L3/L4/L7 flow telemetry joins the same pipeline as app telemetry instead of living in a separate Hubble-only path. This is the integration point that unifies network and app observability.
- **Application code** — OTel SDK emits traces + metrics + logs as OTLP → Collector.
- **Ingress (Cilium Gateway/Envoy)** — Envoy emits OTel-native traces; point them at the Collector and ingress spans stitch into the same traces as app spans.
- **Collector** — the fan-in/fan-out point. Everything above arrives here; it exports out to backends.
- **Backends** — Collector routes: traces → Tempo/Jaeger, metrics → Prometheus (or Prometheus scrapes the Collector), logs → Loki. Grafana reads all three. OTel is the transport; these remain the storage/query layer.

### The overlap you must decide on

OTel and Prometheus both do metrics, so pick a boundary rather than running both blindly:

- **Metrics** — two valid patterns. Either keep Prometheus scraping (Cilium, Hubble, apps all expose Prometheus endpoints) and use OTel only for traces/logs; or route app metrics through the Collector and have Prometheus scrape the Collector's exporter. The first is simpler and is what most low-load setups do — don't route metrics through OTel unless you have a reason (e.g. you want the Collector's processing/enrichment on metrics too).
- **Traces** — OTel is unambiguously the right layer. Nothing else in the stack produces distributed traces.
- **Logs** — OTel logs are workable but less mature than the metrics/traces paths; Loki + Promtail/Alloy is a common alternative. Grafana Alloy is itself an OTel Collector distribution, so this line is blurring.

### In-code / centralized fit

OTel serves both earlier requirements directly. The Collector is deployed and configured as manifests/Helm — pipelines, processors, exporters all declarative, GitOps-managed alongside Cilium. The OpenTelemetry Operator (a CRD-based controller) manages Collector instances and auto-instrumentation via `Instrumentation` CRs, so even the app-injection config is in-code. That makes OTel a natural fit for the Argo CD/Flux delivery model from the previous section.

### Honest assessment for low load

The Collector + tracing is where OTel earns its place — it's the only source of distributed traces, and it centralises telemetry cleanly. Routing metrics through OTel is optional and often not worth the added pipeline complexity at low load; Prometheus direct-scrape is simpler and adequate. So the pragmatic low-load shape is: OTel SDK/auto-instrumentation for traces (+ optionally logs) → Collector → Tempo, while Prometheus keeps scraping Cilium/Hubble/app metrics directly. Add metrics-through-OTel later only if you need the Collector's processing.

The one decision that gates all of this: do you actually want distributed tracing? If yes, OTel is the backbone and belongs in the stack. If you only want network + ingress + basic app metrics and no cross-service traces, OTel adds a pipeline you don't need, and Prometheus + Hubble + Grafana already covers you.
