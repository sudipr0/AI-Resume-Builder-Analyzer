terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = "resumecraft-prod"
  region  = "us-central1"
}

# GKE Cluster
resource "google_container_cluster" "primary" {
  name     = "resumecraft-k8s"
  location = "us-central1-a"

  remove_default_node_pool = true
  initial_node_count       = 1
}

# Managed Node Pool
resource "google_container_node_pool" "primary_nodes" {
  name       = "primary-node-pool"
  location   = "us-central1-a"
  cluster    = google_container_cluster.primary.name
  node_count = 3

  node_config {
    machine_type = "e2-standard-4" # 4 vCPU, 16GB Memory for AI workloads
    
    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }

  autoscaling {
    min_node_count = 3
    max_node_count = 10
  }
}

# Redis Instance (Cloud Memorystore)
resource "google_redis_instance" "cache" {
  name           = "resumecraft-redis"
  memory_size_gb = 2
  region         = "us-central1"
  tier           = "STANDARD_HA" # High availability for queue processing
}
