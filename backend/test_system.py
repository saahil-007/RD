"""
Test script for Kolam Design Analysis and Recreation System

This script verifies that all components are working correctly.
Run this after installation to ensure everything is set up properly.
"""

import sys
import os
import numpy as np
import cv2

def test_imports():
    \"\"\"Test that all required modules can be imported.\"\"\"
    print(\"🔍 Testing imports...\")
    
    try:
        from kolam_design_principles import KolamDesignPrinciples
        print(\"✅ KolamDesignPrinciples imported successfully\")
    except ImportError as e:
        print(f\"❌ Failed to import KolamDesignPrinciples: {e}\")
        return False
    
    try:
        from kolam_recreator import KolamRecreator, generate_traditional_patterns
        print(\"✅ KolamRecreator imported successfully\")
    except ImportError as e:
        print(f\"❌ Failed to import KolamRecreator: {e}\")
        return False
    
    # Test other dependencies
    dependencies = [
        'cv2', 'numpy', 'networkx', 'scipy', 
        'matplotlib', 'skimage'
    ]
    
    for dep in dependencies:
        try:
            __import__(dep)
            print(f\"✅ {dep} available\")
        except ImportError as e:
            print(f\"❌ {dep} not available: {e}\")
            return False
    
    return True

def test_pattern_generation():
    \"\"\"Test pattern generation functionality.\"\"\"
    print(\"\n🎨 Testing pattern generation...\")
    
    try:
        from kolam_recreator import KolamRecreator
        
        recreator = KolamRecreator(400, 400)
        
        # Test different pattern types
        pattern_types = [\"square_loop\", \"diamond_chain\", \"spiral\", \"flower\"]
        
        for pattern_type in pattern_types:
            pattern = recreator.generate_simple_kolam(pattern_type)
            
            if pattern is not None and pattern.shape == (400, 400):
                print(f\"✅ {pattern_type} pattern generated successfully\")
                
                # Save test pattern
                filename = f\"test_{pattern_type}.png\"
                cv2.imwrite(filename, pattern)
                print(f\"   Saved as: {filename}\")
            else:
                print(f\"❌ Failed to generate {pattern_type} pattern\")
                return False
        
        return True
        
    except Exception as e:
        print(f\"❌ Pattern generation failed: {e}\")
        return False

def test_analysis_pipeline():
    \"\"\"Test analysis pipeline with generated pattern.\"\"\"
    print(\"\n🔬 Testing analysis pipeline...\")
    
    try:
        from kolam_design_principles import KolamDesignPrinciples
        from kolam_recreator import KolamRecreator
        
        # Generate a test pattern
        recreator = KolamRecreator(300, 300)
        test_pattern = recreator.generate_simple_kolam(\"square_loop\")
        
        if test_pattern is None:
            print(\"❌ Could not generate test pattern for analysis\")
            return False
        
        # Analyze the pattern
        analyzer = KolamDesignPrinciples(image_array=test_pattern)
        analysis = analyzer.generate_comprehensive_analysis()
        
        # Check analysis results
        required_sections = [
            'grid_structure', 'symmetry_operations', 
            'path_connectivity', 'geometric_patterns',
            'cultural_constraints', 'summary'
        ]
        
        for section in required_sections:
            if section in analysis:
                print(f\"✅ {section} analysis completed\")
            else:
                print(f\"❌ {section} analysis missing\")
                return False
        
        # Check summary
        summary = analysis.get('summary', {})
        if summary:
            print(f\"   Complexity: {summary.get('complexity_level', 'unknown')}\")
            print(f\"   Symmetry: {summary.get('primary_symmetry', 'unknown')}\")
            print(f\"   Authenticity: {summary.get('cultural_authenticity', 'unknown')}\")
        
        return True
        
    except Exception as e:
        print(f\"❌ Analysis pipeline failed: {e}\")
        return False

def test_recreation_from_analysis():
    \"\"\"Test recreation from analysis results.\"\"\"
    print(\"\n🔄 Testing recreation from analysis...\")
    
    try:
        from kolam_design_principles import KolamDesignPrinciples
        from kolam_recreator import KolamRecreator
        
        # Generate and analyze a pattern
        recreator1 = KolamRecreator(250, 250)
        original_pattern = recreator1.generate_simple_kolam(\"flower\")
        
        analyzer = KolamDesignPrinciples(image_array=original_pattern)
        analysis = analyzer.generate_comprehensive_analysis()
        
        # Recreate from analysis
        recreator2 = KolamRecreator(250, 250)
        recreated_pattern = recreator2.recreate_from_analysis(analysis)
        
        if recreated_pattern is not None and recreated_pattern.shape == (250, 250):
            print(\"✅ Recreation from analysis successful\")
            
            # Save both patterns for comparison
            cv2.imwrite(\"test_original.png\", original_pattern)
            cv2.imwrite(\"test_recreated.png\", recreated_pattern)
            print(\"   Saved original and recreated patterns for comparison\")
            
            return True
        else:
            print(\"❌ Recreation from analysis failed\")
            return False
        
    except Exception as e:
        print(f\"❌ Recreation from analysis failed: {e}\")
        return False

def test_api_integration():
    \"\"\"Test API integration (optional - requires FastAPI).\"\"\"
    print(\"\n🌐 Testing API integration...\")
    
    try:
        import main  # This should import without errors
        print(\"✅ Main API module imported successfully\")
        print(\"   Note: Start server with 'uvicorn main:app --reload' to test endpoints\")
        return True
    except ImportError as e:
        print(f\"⚠️ API integration test skipped: {e}\")
        return True  # Not critical for core functionality
    except Exception as e:
        print(f\"❌ API integration test failed: {e}\")
        return False

def cleanup_test_files():
    \"\"\"Clean up generated test files.\"\"\"
    print(\"\n🧹 Cleaning up test files...\")
    
    test_files = [
        \"test_square_loop.png\", \"test_diamond_chain.png\",
        \"test_spiral.png\", \"test_flower.png\",
        \"test_original.png\", \"test_recreated.png\"
    ]
    
    for filename in test_files:
        try:
            if os.path.exists(filename):
                os.remove(filename)
                print(f\"   Removed: {filename}\")
        except Exception as e:
            print(f\"   Could not remove {filename}: {e}\")

def main():
    \"\"\"Run all tests.\"\"\"
    print(\"🧪 KOLAM SYSTEM TEST SUITE\")
    print(\"=\" * 50)
    
    tests = [
        (\"Import Test\", test_imports),
        (\"Pattern Generation Test\", test_pattern_generation),
        (\"Analysis Pipeline Test\", test_analysis_pipeline),
        (\"Recreation Test\", test_recreation_from_analysis),
        (\"API Integration Test\", test_api_integration)
    ]
    
    passed_tests = 0
    total_tests = len(tests)
    
    for test_name, test_func in tests:
        print(f\"\n{'='*20} {test_name} {'='*20}\")
        
        try:
            if test_func():
                print(f\"✅ {test_name} PASSED\")
                passed_tests += 1
            else:
                print(f\"❌ {test_name} FAILED\")
        except Exception as e:
            print(f\"❌ {test_name} FAILED with exception: {e}\")
    
    # Final results
    print(f\"\n{'='*50}\")
    print(f\"TEST RESULTS: {passed_tests}/{total_tests} tests passed\")
    
    if passed_tests == total_tests:
        print(\"🎉 ALL TESTS PASSED! System is ready to use.\")
        print(\"\n🚀 Next steps:\")
        print(\"   1. Run 'python kolam_example.py' for demonstrations\")
        print(\"   2. Start API server: 'uvicorn main:app --reload'\")
        print(\"   3. Launch frontend: 'cd ../frontend && npm run dev'\")
    else:
        print(f\"⚠️  {total_tests - passed_tests} test(s) failed. Please check the installation.\")
        print(\"\n🔧 Troubleshooting:\")
        print(\"   1. Ensure all dependencies are installed: 'pip install -r requirements.txt'\")
        print(\"   2. Check Python version (3.8+ required)\")
        print(\"   3. Verify OpenCV installation: 'python -c \\\"import cv2; print(cv2.__version__)\\\"'\")
    
    # Ask about cleanup
    try:
        response = input(\"\n🗑️  Remove test files? (y/n): \").lower().strip()
        if response in ['y', 'yes']:
            cleanup_test_files()
    except KeyboardInterrupt:
        print(\"\nTest completed.\")

if __name__ == \"__main__\":
    main()